const express = require('express');
const Chat = require('../models/chat');
const router = express.Router();

// Route to send a new message
router.post('/send', async (req, res) => {
  const { sender, receiver, message } = req.body;
  try {
    const newMessage = new Chat({ sender, receiver, message });
    await newMessage.save();
    res.status(201).send(newMessage);
  } catch (error) {
    res.status(500).send({ error: 'Failed to send message' });
  }
});

// Endpoint to get chat messages between two users
router.get('/messages/:currentUserId/:chatPartnerId', async (req, res) => {
  const { currentUserId, chatPartnerId } = req.params;

  try {
    const chatMessages = await Chat.find({
      $or: [
        { sender: currentUserId, receiver: chatPartnerId },
        { sender: chatPartnerId, receiver: currentUserId },
      ],
    }).sort({ timestamp: 1 }); // Sort messages by the timestamp

    res.status(200).json(chatMessages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve chat messages' });
  }
});

module.exports = router;
