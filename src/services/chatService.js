const ChatSession = require('../models/ChatSession');

const Speaker = require('../models/Speaker');

const { generateChatResponse } = require('./geminiService');

const { sendNotification } = require('../utils/serviceBusClient');

async function getChatSession(sessionId) {

  try {

    const session = await ChatSession.findOne({ sessionId }).lean();

    if (!session) throw new Error('Chat session not found');

    const speaker = await Speaker.findOne({ id: session.speakerId }).lean();

    if (!speaker) throw new Error('Speaker not found');

    return {

      speaker: {

        name: speaker.name,

        description: `${speaker.language} speaker`,

        avatarSeed: speaker.avatarSeed,

        flagUrl: `https://hatscripts.github.io/circle-flags/flags/${getCountryCode(speaker.language)}.svg`,

        personality: speaker.personality,

        interests: speaker.interests

      },

      messages: session.messages

    };

  } catch (error) {

    console.error('❌ Error fetching chat session:', error.message);

    throw error;

  }

}

async function sendMessage(sessionId, userId, text) {

  try {

    let session = await ChatSession.findOne({ sessionId });

    if (!session) {

      const speakerId = sessionId.replace('chat_', '');

      session = new ChatSession({ sessionId, userId, speakerId, messages: [] });

    }

    const speaker = await Speaker.findOne({ id: session.speakerId });

    if (!speaker) throw new Error('Speaker not found');

    // Save user message

    const userMessageId = session.messages.length + 1;

    const userMessage = { id: userMessageId, sender: 'user', text, timestamp: new Date() };

    session.messages.push(userMessage);

    await session.save();

    // Generate AI response

    const aiResponse = await generateChatResponse(speaker, text, session.messages);

    // Save assistant message

    const speakerMessageId = userMessageId + 1;

    const speakerMessage = { id: speakerMessageId, sender: 'speaker', text: aiResponse, timestamp: new Date() };

    session.messages.push(speakerMessage);

    session.lastActivityAt = new Date();

    await session.save();

    // Send notification

    await sendNotification('NEW_MESSAGE', {

      userId,

      speakerId: speaker.id,

      speakerName: speaker.name,

      messagePreview: aiResponse.substring(0, 50)

    });

    return {

      success: true,

      echo: {

        receivedAtUtc: new Date().toISOString(),

        sessionId,

        yourMessage: text

      },

      assistantReply: speakerMessage

    };

  } catch (error) {

    console.error('❌ Error sending message:', error.message);

    throw error;

  }

}

async function getRecentChats(userId) {

  try {

    const sessions = await ChatSession.find({ userId })

      .sort({ lastActivityAt: -1 })

      .limit(10)

      .lean();

    const speakerIds = [...new Set(sessions.map(s => s.speakerId))];

    const speakers = await Speaker.find({ id: { $in: speakerIds } }).lean();

    const speakerMap = Object.fromEntries(speakers.map(s => [s.id, s]));

    const recentChats = sessions.map(session => {

      const speaker = speakerMap[session.speakerId];

      const lastMessage = session.messages[session.messages.length - 1];

      return {

        id: session._id,

        speakerId: session.speakerId,

        chatId: session.sessionId,

        name: speaker?.name || 'Unknown',

        lastMessage: lastMessage?.text || 'No messages',

        timestamp: formatTimestamp(session.lastActivityAt),

        unread: false,

        color: speaker?.color || 'teal',

        avatarSeed: speaker?.avatarSeed || 'default',

        flagEmoji: speaker?.flagEmoji || '🌍'

      };

    });

    return recentChats;

  } catch (error) {

    console.error('❌ Error fetching recent chats:', error.message);

    throw error;

  }

}

function getCountryCode(language) {

  const map = {

    'Spanish': 'es', 'German': 'de', 'French': 'fr', 'Portuguese': 'pt',

    'Mandarin': 'cn', 'Italian': 'it', 'Japanese': 'jp', 'Korean': 'kr'

  };

  return map[language] || 'un';

}

function formatTimestamp(date) {

  const now = new Date();

  const diff = now - new Date(date);

  const minutes = Math.floor(diff / 60000);

  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);

  return `${days}d ago`;

}

module.exports = { getChatSession, sendMessage, getRecentChats };
