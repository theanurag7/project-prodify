// src/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// route modules
const aiRoutes = require('./routes/ai');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// middlewares
const allowedOrigins = [
  'http://localhost:5173',
];
const vercelPreviewRegex = /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || vercelPreviewRegex.test(origin)) {
      return callback(null, true);
    }
    console.warn('Blocked by CORS:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Ensure DB is connected before handling any request.
app.use(async (req, res, next) => {
  try {
    await connectDB(process.env.MONGO_URI);
    next();
  } catch (err) {
    console.error('DB connection failed for request:', err.message);
    res.status(503).json({ message: 'Database unavailable, please try again shortly' });
  }
});

// mount routes
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);

// attach pomodoro route (DO NOT use express.Router here)
try {
  require('./routes/pomodoro')(app);
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
