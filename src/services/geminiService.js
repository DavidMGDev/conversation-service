const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**

 * Generates chat response based on speaker personality

 * @param {Object} speaker - Speaker object with personality, interests, language

 * @param {String} userMessage - User's message

 * @param {Array} chatHistory - Previous messages for context

 * @returns {String} AI response

 */

async function generateChatResponse(speaker, userMessage, chatHistory = []) {

  try {

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = `You are ${speaker.name}, a ${speaker.language} language practice partner.

Your personality traits:

${speaker.personality.map(p => `- ${p}`).join('\n')}

Your interests:

${speaker.interests.map(i => `- ${i}`).join('\n')}

IMPORTANT RULES:

1. Always respond in ${speaker.language}

2. Keep responses concise (2-3 sentences)

3. Gently correct user mistakes

4. Ask follow-up questions`;

    let conversationContext = systemPrompt + '\n\nConversation history:\n';

    const recentMessages = chatHistory.slice(-10);

    recentMessages.forEach(msg => {

      const role = msg.sender === 'user' ? 'User' : speaker.name;

      conversationContext += `${role}: ${msg.text}\n`;

    });

    conversationContext += `\nUser: ${userMessage}\n${speaker.name}:`;

    const result = await model.generateContent(conversationContext);

    const response = await result.response;

    return response.text().trim();

  } catch (error) {

    console.error('❌ Gemini API error:', error.message);

    if (error.message.includes('RESOURCE_EXHAUSTED')) {

      return 'Lo siento, estoy teniendo problemas técnicos. Por favor intenta de nuevo.';

    }

    throw new Error('Error generating chat response');

  }

}

/**

 * Translates a word to multiple languages

 * @param {String} word - Word to translate

 * @param {String} fromLanguage - Source language

 * @param {Array} toLanguages - Target languages

 * @returns {Array} Translations

 */

async function translateWord(word, fromLanguage, toLanguages) {

  try {

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `Translate "${word}" from ${fromLanguage} to ${toLanguages.join(', ')}. Return ONLY JSON array: [{"language":"English","word":"translation","color":"blue"},...]`;

    const result = await model.generateContent(prompt);

    let text = result.response.text().trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');

    return JSON.parse(text);

  } catch (error) {

    console.error('❌ Translation error:', error.message);

    return toLanguages.map(lang => ({ language: lang, word, color: 'teal' }));

  }

}

/**

 * Retry logic with exponential backoff

 */

async function retryWithBackoff(fn, maxRetries = 3) {

  for (let i = 0; i < maxRetries; i++) {

    try {

      return await fn();

    } catch (error) {

      if (i === maxRetries - 1) throw error;

      const delay = Math.pow(2, i) * 1000;

      console.log(`⚠️ Retry attempt ${i + 1} after ${delay}ms`);

      await new Promise(resolve => setTimeout(resolve, delay));

    }

  }

}

module.exports = { generateChatResponse, translateWord, retryWithBackoff };
