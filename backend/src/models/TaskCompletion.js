// src/models/TaskCompletion.js
const mongoose = require('mongoose');

const taskCompletionSchema = new mongoose.Schema({
  taskId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  action: { 
    type: String, 
    enum: ['completed', 'pomodoro_session'], 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  pointsAwarded: { 
    type: Number, 
    default: 0 
  },
  meta: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {} 
  }
});

module.exports = mongoose.model('TaskCompletion', taskCompletionSchema);