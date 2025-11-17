const chatService = require('../services/chatService');

async function getSession(req, res, next) {

  try {

    const { sessionId } = req.params;

    const session = await chatService.getChatSession(sessionId);

    res.json(session);

  } catch (error) {

    next(error);

  }

}

async function sendMessage(req, res, next) {

  try {

    const { sessionId } = req.params;

    const { userId, text } = req.body;

    if (!text?.trim()) {

      return res.status(400).json({ success: false, message: 'Message text is required' });

    }

    const result = await chatService.sendMessage(sessionId, userId, text.trim());

    res.json(result);

  } catch (error) {

    next(error);

  }

}

async function getRecent(req, res, next) {

  try {

    const userId = req.query.userId || req.body.userId;

    const chats = await chatService.getRecentChats(userId);

    res.json({ recentChats: chats });

  } catch (error) {

    next(error);

  }

}

module.exports = { getSession, sendMessage, getRecent };
