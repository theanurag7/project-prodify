// src/routes/tasks.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/taskController');

router.use(auth); // protect all task routes

router.get('/', ctrl.listTasks);
router.post('/', ctrl.createTask);
router.get('/:id', ctrl.getTask);
router.put('/:id', ctrl.updateTask);
router.delete('/:id', ctrl.deleteTask);

router.post('/:id/complete', ctrl.completeTask);
router.post('/:id/pomodoro/complete', ctrl.completePomodoro);

module.exports = router;