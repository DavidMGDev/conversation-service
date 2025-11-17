const express = require('express');

const router = express.Router();

const dictionaryController = require('../controllers/dictionaryController');

// Certificate authentication is handled globally in server.js via mTLS

router.get('/catalog', dictionaryController.getCatalog);

router.get('/words', dictionaryController.getWords);

router.post('/words/update-translations', dictionaryController.updateTranslations);

router.post('/words/:id/forget', dictionaryController.forgetWord);

module.exports = router;
