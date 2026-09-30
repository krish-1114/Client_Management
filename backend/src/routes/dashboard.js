const express = require('express');
const Client = require('../models/Client');
const Activity = require('../models/Activity');
const { asyncHandler } = require('../middleware/errors');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const [total, active, inactive, recentClients, recentActivities] = await Promise.all([
      Client.countDocuments(),
      Client.countDocuments({ status: 'Active' }),
      Client.countDocuments({ status: 'Inactive' }),
      Client.find().sort({ createdAt: -1 }).limit(5).lean(),
      Activity.find().sort({ createdAt: -1 }).limit(8).populate('client', 'name').lean(),
    ]);
    res.json({ total, active, inactive, recentClients, recentActivities });
  })
);

module.exports = router;
