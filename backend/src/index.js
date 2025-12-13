// src/index.js
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI missing in .env — create a .env file from .env.example before starting the server.');
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET missing in .env — add JWT_SECRET to your .env file.');
  process.exit(1);
}

connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});