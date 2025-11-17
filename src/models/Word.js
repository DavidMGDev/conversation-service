const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({

  language: { type: String, required: true },

  word: { type: String, required: true },

  color: { type: String, enum: ['teal', 'pink', 'yellow', 'orange', 'blue', 'green', 'red', 'purple', 'sky', 'indigo', 'emerald', 'rose'], required: true }

}, { _id: false });

const wordSchema = new mongoose.Schema({

  userId: { type: String, required: true, index: true },

  word: { type: String, required: true, trim: true },

  sourceLanguage: { type: String, required: true },

  color: { type: String, enum: ['teal', 'pink', 'yellow', 'orange', 'blue', 'green', 'red', 'purple', 'sky', 'indigo', 'emerald', 'rose'], default: 'teal' },

  translated: { type: Boolean, default: false },

  translations: [translationSchema],

  addedAt: { type: Date, default: Date.now }

});

wordSchema.index({ userId: 1, sourceLanguage: 1 });

module.exports = mongoose.model('Word', wordSchema);
