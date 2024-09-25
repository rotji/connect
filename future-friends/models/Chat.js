const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  senderEmail: {
    type: String,
    required: true,
  },
  receiverEmail: {
    type: String,
    required: true,
  },
  messages: [
    {
      sender: String,
      text: String,
      timestamp: { type: Date, default: Date.now },
    }
  ]
});

module.exports = mongoose.model('Chat', chatSchema);
