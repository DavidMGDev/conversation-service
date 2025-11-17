const express = require('express');

const router = express.Router();

const speakerController = require('../controllers/speakerController');

// Certificate authentication is handled globally in server.js via mTLS
// JWT authentication is used for user identification

router.get('/catalog', speakerController.getCatalog);

router.get('/saved', speakerController.getSaved);

router.post('/add', speakerController.addSpeaker);

module.exports = router;
