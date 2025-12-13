// src/routes/analytics.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/analyticsController');

router.use(auth);
router.get('/points/weekly', ctrl.weeklyPoints);

module.exports = router;
