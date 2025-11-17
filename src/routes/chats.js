const express = require('express');

const router = express.Router();

const chatController = require('../controllers/chatController');

// Certificate authentication is handled globally in server.js via mTLS

router.get('/session/:sessionId', chatController.getSession);

router.post('/session/:sessionId/message', chatController.sendMessage);

router.get('/recent', chatController.getRecent);

module.exports = router;
