// src/controllers/taskController.js
const Task = require('../models/Task');
const TaskCompletion = require('../models/TaskCompletion');

const createTask = async (req, res) => {
  console.log('✅ CREATE TASK called');
  try {
    if (!req.body.title || req.body.title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const data = { ...req.body, userId: req.user.id };
    const task = new Task(data);
    await task.save();
    console.log('✅ Task created:', task._id);
    res.status(201).json(task);
  } catch (err) {
    console.error('❌ Create task error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const listTasks = async (req, res) => {
  console.log('🔥🔥🔥 LIST TASKS CALLED 🔥🔥🔥');
  console.log('User ID:', req.user?.id);
  
  try {
    const filter = { userId: req.user.id };
    console.log('About to query database...');
    
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    
    console.log('✅ Found tasks:', tasks.length);
    console.log('Sending response...');
    
    res.json({ tasks });
    
    console.log('✅ Response sent successfully');
  } catch (err) {
    console.error('❌ List tasks error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTask = async (req, res) => {
  console.log('✅ GET TASK called for ID:', req.params.id);
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error('❌ Get task error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  console.log('✅ UPDATE TASK called for ID:', req.params.id);
  try {
    // Remove userId from update data if present
    if (req.body.userId) delete req.body.userId;

    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    
    if (!updated) return res.status(404).json({ message: 'Task not found' });
    console.log('✅ Task updated');
    res.json(updated);
  } catch (err) {
    console.error('❌ Update task error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  console.log('✅ DELETE TASK called for ID:', req.params.id);
  try {
    const removed = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!removed) return res.status(404).json({ message: 'Task not found' });
    console.log('✅ Task deleted');
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('❌ Delete task error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const completeTask = async (req, res) => {
  console.log('✅ COMPLETE TASK called for ID:', req.params.id);
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Award points
    const points = 10;
    await TaskCompletion.create({
      taskId: task._id,
      userId: req.user.id,
      action: 'completed',
      pointsAwarded: points,
      meta: {}
    });

    task.completed = true;
    await task.save();

    console.log('✅ Task completed, points awarded:', points);
    res.json({ message: 'Task completed', pointsAwarded: points, task });
  } catch (err) {
    console.error('❌ Complete task error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const completePomodoro = async (req, res) => {
  console.log('✅ COMPLETE POMODORO called for ID:', req.params.id);
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const sessionPoints = 2;
    const record = await TaskCompletion.create({
      taskId: task._id,
      userId: req.user.id,
      action: 'pomodoro_session',
      pointsAwarded: sessionPoints,
      meta: { durationMinutes: req.body.durationMinutes || 25 }
    });

    console.log('✅ Pomodoro recorded');
    res.json({ message: 'Pomodoro recorded', sessionPoints, record });
  } catch (err) {
    console.error('❌ Complete pomodoro error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createTask, 
  listTasks, 
  getTask, 
  updateTask, 
  deleteTask, 
  completeTask, 
  completePomodoro
};