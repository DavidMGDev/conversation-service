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

    process.exit(1);

  }

};

module.exports = connectDB;
