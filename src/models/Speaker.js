const mongoose = require('mongoose');

const speakerSchema = new mongoose.Schema({

  id: { type: String, required: true, unique: true, index: true },

  name: { type: String, required: true, trim: true },

  language: { type: String, required: true },

  flagEmoji: { type: String, required: true },

  avatarSeed: { type: String, required: true },

  personality: [{ type: String }],

  interests: [{ type: String }],

  color: { type: String, enum: ['teal', 'pink', 'yellow', 'orange', 'blue', 'green', 'red', 'purple', 'sky', 'indigo', 'emerald', 'rose'], required: true },

  createdAt: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Speaker', speakerSchema);
