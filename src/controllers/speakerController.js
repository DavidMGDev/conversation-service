const speakerService = require('../services/speakerService');

async function getCatalog(req, res, next) {

  try {

    const speakers = await speakerService.getAllSpeakers();

    res.json({ speakers });

  } catch (error) {

    next(error);

  }

}

async function getSaved(req, res, next) {

  try {

    const userId = req.query.userId || req.body.userId;

    const speakers = await speakerService.getSavedSpeakers(userId);

    res.json({ savedSpeakers: speakers });

  } catch (error) {

    next(error);

  }

}

async function addSpeaker(req, res, next) {

  try {

    const { userId, id, name, avatarSeed, flagEmoji } = req.body;

    if (!id || !name) {

      return res.status(400).json({ success: false, message: 'Missing required fields: id, name' });

    }

    const result = await speakerService.addSpeaker(userId, { id, name, avatarSeed, flagEmoji });

    res.json(result);

  } catch (error) {

    next(error);

  }

}

module.exports = { getCatalog, getSaved, addSpeaker };
