// src/middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  console.log('🔐 AUTH MIDDLEWARE CALLED for:', req.method, req.path);
  
  const header = req.headers.authorization || '';
  console.log('Authorization header:', header.substring(0, 20) + '...');
  
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  
  if (!token) {
    console.log('❌ No token found');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email };
    console.log('✅ Auth successful, user ID:', req.user.id);
    next();
  } catch (err) {
    console.log('❌ Invalid token');
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;