const mongoose = require('mongoose');

const connectDB = async () => {

  try {

    const options = {

      maxPoolSize: 10,

      serverSelectionTimeoutMS: 5000,

      socketTimeoutMS: 45000,

    };



    await mongoose.connect(process.env.MONGO_URI, options);

    console.log('✅ MongoDB (Cosmos DB) connected successfully');

  } catch (error) {

    console.error('❌ MongoDB connection error:', error.message);

    console.log('💡 Tip: Check if your IP is whitelisted in Azure Cosmos DB firewall');

    // In production, don't exit immediately - let the app start and retry
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️ Running in production mode - continuing despite DB connection failure');
      console.log('💡 The app will attempt to reconnect on first request');
      return; // Don't exit, let the app start
    } else {
      process.exit(1);
    }

  }

};

module.exports = connectDB;
