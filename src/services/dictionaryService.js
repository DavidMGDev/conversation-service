const Dictionary = require('../models/Dictionary');

const Word = require('../models/Word');

const { translateWord } = require('./geminiService');

const { sendNotification } = require('../utils/serviceBusClient');

async function getDictionaries(userId) {

  try {

    const dictionaries = await Dictionary.find({ userId }).populate('words').lean();

    return dictionaries.map(dict => ({

      id: dict._id,

      language: dict.language,

      wordCount: dict.words.length,

      flagUrl: dict.flagUrl

    }));

  } catch (error) {

    console.error('❌ Error fetching dictionaries:', error.message);

    throw error;

  }

}

async function getWords(userId, language) {

  try {

    const dictionary = await Dictionary.findOne({ userId, language }).populate('words').lean();

    if (!dictionary) return [];

    return dictionary.words.map(word => ({

      id: word._id,

      word: word.word,

      color: word.color,

      translated: word.translated,

      translations: word.translations

    }));

  } catch (error) {

    console.error('❌ Error fetching words:', error.message);

    throw error;

  }

}

async function addWord(userId, wordText, sourceLanguage) {

  try {

    let dictionary = await Dictionary.findOne({ userId, language: sourceLanguage });

    if (!dictionary) {

      dictionary = new Dictionary({

        userId,

        language: sourceLanguage,

        flagUrl: `https://hatscripts.github.io/circle-flags/flags/${getLanguageCode(sourceLanguage)}.svg`,

        words: []

      });

    }

    const word = new Word({

      userId,

      word: wordText,

      sourceLanguage,

      color: getRandomColor(),

      translated: false,

      translations: []

    });

    await word.save();

    dictionary.words.push(word._id);

    await dictionary.save();

    await sendNotification('WORD_SAVED', {

      userId,

      word: wordText,

      language: sourceLanguage

    });

    return { success: true, word };

  } catch (error) {

    console.error('❌ Error adding word:', error.message);

    throw error;

  }

}

async function updateTranslations(userId) {

  try {

    const words = await Word.find({ userId, translated: false });

    if (words.length === 0) {

      return { success: true, message: 'No words to translate' };

    }

    // TODO: Get user's target languages from User Service

    const userLanguages = ['English', 'French', 'German'];

    for (const word of words) {

      try {

        const translations = await translateWord(word.word, word.sourceLanguage, userLanguages);

        word.translations = translations;

        word.translated = true;

        await word.save();

      } catch (e) {

        console.error(`⚠️ Failed to translate ${word.word}:`, e.message);

      }

    }

    return { success: true, translatedCount: words.length };

  } catch (error) {

    console.error('❌ Error updating translations:', error.message);

    throw error;

  }

}

async function forgetWord(userId, wordId) {

  try {

    const word = await Word.findOne({ _id: wordId, userId });

    if (!word) throw new Error('Word not found');

    await Dictionary.updateOne(

      { userId, language: word.sourceLanguage },

      { $pull: { words: wordId } }

    );

    await Word.deleteOne({ _id: wordId });

    return { success: true, message: 'Word removed successfully' };

  } catch (error) {

    console.error('❌ Error forgetting word:', error.message);

    throw error;

  }

}

function getLanguageCode(language) {

  const map = { 'Spanish': 'es', 'German': 'de', 'French': 'fr', 'Portuguese': 'pt', 'Mandarin': 'cn' };

  return map[language] || 'un';

}

function getRandomColor() {

  const colors = ['teal', 'pink', 'yellow', 'orange', 'blue', 'green', 'red', 'purple', 'sky', 'indigo', 'emerald', 'rose'];

  return colors[Math.floor(Math.random() * colors.length)];

}

module.exports = { getDictionaries, getWords, addWord, updateTranslations, forgetWord };
