const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({

  id: { type: Number, required: true },

  sender: { type: String, enum: ['user', 'speaker'], required: true },

  text: { type: String, required: true },

  timestamp: { type: Date, default: Date.now }

}, { _id: false });

const chatSessionSchema = new mongoose.Schema({

  sessionId: { type: String, required: true, unique: true, index: true },

  userId: { type: String, required: true, index: true },

  speakerId: { type: String, required: true, ref: 'Speaker' },

  messages: [messageSchema],

  lastActivityAt: { type: Date, default: Date.now },

  createdAt: { type: Date, default: Date.now }

});

module.exports = mongoose.model('ChatSession', chatSessionSchema);
