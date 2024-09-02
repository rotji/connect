// routes/notifications.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get all notifications for a user
router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
});

// Mark notifications as read
router.post('/read/:notificationId', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.notificationId, { read: true });
    res.status(200).json({ message: 'Notification marked as read.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read.' });
  }
});

// Toggle notifications on/off for a user
router.post('/toggle/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.notificationsEnabled = !user.notificationsEnabled;
    await user.save();
    res.status(200).json({ notificationsEnabled: user.notificationsEnabled });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle notifications.' });
  }
});

module.exports = router;
