const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');

// Create or update a chat between two users
router.post('/message', async (req, res) => {
  const { senderEmail, receiverEmail, message } = req.body;

  try {
    let chat = await Chat.findOne({
      $or: [
        { senderEmail, receiverEmail },
        { senderEmail: receiverEmail, receiverEmail: senderEmail }
      ]
    });

    if (!chat) {
      chat = new Chat({ senderEmail, receiverEmail, messages: [] });
    }

    chat.messages.push({ sender: senderEmail, text: message });
    await chat.save();

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

// Get chat messages between two users
router.get('/messages', async (req, res) => {
  const { senderEmail, receiverEmail } = req.query;

  try {
    const chat = await Chat.findOne({
      $or: [
        { senderEmail, receiverEmail },
        { senderEmail: receiverEmail, receiverEmail: senderEmail }
      ]
    });

    if (!chat) return res.status(404).json({ message: 'No chat found.' });

    res.status(200).json(chat.messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve messages.' });
  }
});

module.exports = router;
