// src/models/Task.js
const mongoose = require('mongoose');

const recurrenceSchema = new mongoose.Schema({
  type: { type: String, enum: ['none','daily','weekly','custom'], default: 'none' },
  interval: { type: Number, default: 1 },
  daysOfWeek: { type: [Number], default: [] },
  customIntervalDays: { type: Number, default: 0 }
}, { _id: false });

const pomodoroSchema = new mongoose.Schema({
  workMinutes: { type: Number, default: 25 },
  shortBreak: { type: Number, default: 5 },
  longBreak: { type: Number, default: 15 },
  sessionsPerLongBreak: { type: Number, default: 4 }
}, { _id: false });

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },

  title: { type: String, required: true },
  description: { type: String, default: '' },

  dueDate: { type: Date, default: null, index: true },

  priority: { type: String, enum: ['low','normal','medium','high'], default: 'normal' },
  tags: { type: [String], default: [] },

  completed: { type: Boolean, default: false },

  repeatable: { type: Boolean, default: false },
  recurrence: { type: recurrenceSchema, default: () => ({ type: 'none' }) },

  pomodoro: { type: pomodoroSchema, default: () => ({}) },

  basePoints: { type: Number, default: 10 },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);