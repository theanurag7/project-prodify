// src/config/db.js
const mongoose = require('mongoose');

// Cache the connection across serverless invocations to avoid exhausting
// Atlas connection limits and to speed up warm invocations.
let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

const connectDB = async (mongoUri) => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoUri, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log('✅ MongoDB connected');
        return mongooseInstance;
      })
      .catch((error) => {
        cached.promise = null; // allow retry on next request
        console.error('❌ MongoDB connection error:', error.message);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;
