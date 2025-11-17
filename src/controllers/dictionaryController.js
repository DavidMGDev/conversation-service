const dictionaryService = require('../services/dictionaryService');

async function getCatalog(req, res, next) {

  try {

    const userId = req.query.userId || req.body.userId;

    const dictionaries = await dictionaryService.getDictionaries(userId);

    res.json({ dictionaries });

  } catch (error) {

    next(error);

  }

}

async function getWords(req, res, next) {

  try {

    const userId = req.query.userId || req.body.userId;

    const { language } = req.query;

    if (!language) {

      return res.status(400).json({ success: false, message: 'Language query parameter is required' });

    }

    const words = await dictionaryService.getWords(userId, language);

    res.json({ words });

  } catch (error) {

    next(error);

  }

}

async function updateTranslations(req, res, next) {

  try {

    const userId = req.body.userId;

    const result = await dictionaryService.updateTranslations(userId);

    res.json(result);

  } catch (error) {

    next(error);

  }

}

async function forgetWord(req, res, next) {

  try {

    const userId = req.body.userId || req.query.userId;

    const { id } = req.params;

    const result = await dictionaryService.forgetWord(userId, id);

    res.json(result);

  } catch (error) {

    next(error);

  }

}

module.exports = { getCatalog, getWords, updateTranslations, forgetWord };
