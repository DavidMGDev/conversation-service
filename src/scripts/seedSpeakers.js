require('dotenv').config();

const mongoose = require('mongoose');

const Speaker = require('../models/Speaker');

const speakers = [

  { id: 'aurora-001', name: 'Aurora', language: 'Spanish', flagEmoji: '🇪🇸', avatarSeed: 'Aurora', personality: ['Friendly', 'Patient', 'Encouraging'], interests: ['Music', 'Travel', 'Culture'], color: 'pink' },

  { id: 'hans-002', name: 'Hans', language: 'German', flagEmoji: '🇩🇪', avatarSeed: 'Hans', personality: ['Serious', 'Precise', 'Professional'], interests: ['Engineering', 'Technology', 'History'], color: 'blue' },

  { id: 'marie-003', name: 'Marie', language: 'French', flagEmoji: '🇫🇷', avatarSeed: 'Marie', personality: ['Artistic', 'Romantic', 'Sophisticated'], interests: ['Art', 'Fashion', 'Cuisine'], color: 'purple' },

  { id: 'joao-004', name: 'João', language: 'Portuguese', flagEmoji: '🇧🇷', avatarSeed: 'Joao', personality: ['Relaxed', 'Funny', 'Warm'], interests: ['Football', 'Beach', 'Music'], color: 'green' },

  { id: 'mei-005', name: 'Mei', language: 'Mandarin', flagEmoji: '🇨🇳', avatarSeed: 'Mei', personality: ['Curious', 'Diligent', 'Respectful'], interests: ['Literature', 'Calligraphy', 'Tea'], color: 'red' },

  { id: 'giulia-006', name: 'Giulia', language: 'Italian', flagEmoji: '🇮🇹', avatarSeed: 'Giulia', personality: ['Expressive', 'Passionate', 'Warm'], interests: ['Food', 'Opera', 'Architecture'], color: 'orange' },

  { id: 'yuki-007', name: 'Yuki', language: 'Japanese', flagEmoji: '🇯🇵', avatarSeed: 'Yuki', personality: ['Polite', 'Thoughtful', 'Reserved'], interests: ['Anime', 'Gardens', 'Tradition'], color: 'sky' },

  { id: 'minji-008', name: 'Minji', language: 'Korean', flagEmoji: '🇰🇷', avatarSeed: 'Minji', personality: ['Energetic', 'Modern', 'Trendy'], interests: ['K-pop', 'Technology', 'Fashion'], color: 'teal' }

];

async function seedSpeakers() {

  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ Connected to MongoDB');

    await Speaker.deleteMany({});

    console.log('🗑️  Cleared existing speakers');

    await Speaker.insertMany(speakers);

    console.log(`✅ Inserted ${speakers.length} speakers`);

    process.exit(0);

  } catch (error) {

    console.error('❌ Seeding error:', error.message);

    process.exit(1);

  }

}

seedSpeakers();
