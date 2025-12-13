// src/routes/ai.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { chat } = require('../controllers/aiController');

// Protect the AI chat endpoint with authentication
router.post('/chat', auth, chat);

module.exports = router;