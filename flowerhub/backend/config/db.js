const mongoose = require('mongoose');

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flowerhub';
  try {
    // Try connecting to local or specified MongoDB instance with a short timeout
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[MongoDB] Connected successfully to ${MONGO_URI}`);
  } catch (err) {
    console.log('[MongoDB] Could not connect to MongoDB server directly. Spinning up Mongo Memory Server fallback...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`[MongoDB Memory Server] Running in-memory database at ${uri}`);
    } catch (memErr) {
      console.error('[MongoDB] Error starting memory database:', memErr);
    }
  }
};

module.exports = connectDB;
