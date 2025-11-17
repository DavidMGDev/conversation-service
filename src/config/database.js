const mongoose = require('mongoose');

const connectDB = async () => {

  try {

    // === FIX: Removed deprecated options ===

    await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ MongoDB (Cosmos DB) connected successfully');

  } catch (error) {

    console.error('❌ MongoDB connection error:', error.message);

    process.exit(1);

  }

};

module.exports = connectDB;
