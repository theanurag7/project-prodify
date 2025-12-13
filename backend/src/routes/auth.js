// src/routes/auth.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// controller functions
const { register, login, me } = require('../controllers/authController');

// routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);

module.exports = router;