// src/controllers/analyticsController.js
const TaskCompletion = require('../models/TaskCompletion');
const mongoose = require('mongoose');

const weeklyPoints = async (req, res) => {
  try {
    const weeks = parseInt(req.query.weeks || '12', 10);
    // compute start date (weeks * 7 days ago)
    const start = new Date();
    start.setDate(start.getDate() - weeks * 7);

    const userId = new mongoose.Types.ObjectId(req.user.id);

    const pipeline = [
      { $match: { userId, timestamp: { $gte: start } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
          },
          points: { $sum: "$pointsAwarded" }
        }
      },
      { $sort: { "_id": 1 } }
    ];

    const rows = await TaskCompletion.aggregate(pipeline);

    // format as [{ date, points }]
    const result = rows.map(r => ({
      date: r._id,
      points: r.points
    }));

    res.json(result);
  } catch (err) {
    console.error('analytics error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { weeklyPoints };