// src/routes/pomodoro.js
// Exports a function that attaches routes directly to the Express `app`
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const TaskCompletion = require('../models/TaskCompletion');

module.exports = function attachPomodoroRoute(app) {
  // POST /api/pomodoro/sessions - Create a new session
  app.post('/api/pomodoro/sessions', async (req, res) => {
    try {
      const { duration = 0, pointsEarned = 0, userId: bodyUserId } = req.body || {};

      // extract user id from Authorization header if present
      let userId = null;
      try {
        const header = (req.headers.authorization || '');
        const token = header.startsWith('Bearer ') ? header.slice(7) : null;
        if (token) {
          const payload = jwt.verify(token, process.env.JWT_SECRET);
          userId = payload.id || payload._id || null;
        }
      } catch (err) {
        userId = null;
      }

      const finalUserId = userId || bodyUserId || null;
      if (!finalUserId) {
        return res.status(400).json({ success: false, message: 'userId required' });
      }

      const finalTaskId = new mongoose.Types.ObjectId();

      const entry = new TaskCompletion({
        taskId: finalTaskId,
        userId: finalUserId,
        action: 'pomodoro_session',
        timestamp: Date.now(),
        pointsAwarded: pointsEarned,
        meta: { duration }
      });

      const saved = await entry.save();
      return res.status(201).json({ success: true, data: saved });
    } catch (err) {
      console.error('pomodoro save error', err);
      return res.status(500).json({ success: false, message: 'Server error while saving pomodoro session' });
    }
  });

  // GET /api/pomodoro/sessions - Get user's pomodoro sessions
  app.get('/api/pomodoro/sessions', async (req, res) => {
    try {
      // extract user id from Authorization header
      let userId = null;
      try {
        const header = (req.headers.authorization || '');
        const token = header.startsWith('Bearer ') ? header.slice(7) : null;
        if (token) {
          const payload = jwt.verify(token, process.env.JWT_SECRET);
          userId = payload.id || payload._id || null;
        }
      } catch (err) {
        userId = null;
      }

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const sessions = await TaskCompletion.find({ 
        userId, 
        action: 'pomodoro_session' 
      }).sort({ timestamp: -1 }).limit(100);

      return res.json({ success: true, sessions });
    } catch (err) {
      console.error('get pomodoro sessions error', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  });
};