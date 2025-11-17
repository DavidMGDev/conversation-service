const mongoose = require('mongoose');

const dictionarySchema = new mongoose.Schema({

  userId: { type: String, required: true, index: true },

  language: { type: String, required: true },

  flagUrl: { type: String, required: true },

  words: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Word' }],

  createdAt: { type: Date, default: Date.now }

});

dictionarySchema.index({ userId: 1, language: 1 }, { unique: true });

module.exports = mongoose.model('Dictionary', dictionarySchema);
