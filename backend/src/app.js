// src/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// route modules
const aiRoutes = require('./routes/ai');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// middlewares
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://*.vercel.app',  // Allows any Vercel subdomain
  ],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// mount routes
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);

// attach pomodoro route (DO NOT use express.Router here)
try {
  require('./routes/pomodoro')(app);   // attaches /api/pomodoro/sessions
} catch (err) {
  console.error('Failed to attach pomodoro route:', err);
}

// health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal server error' 
  });
});

module.exports = app;