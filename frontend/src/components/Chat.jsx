// src/components/Chat.jsx
import React from 'react';

const Chat = ({ messages, message, setMessage, sendMessage }) => (
  <div className="chat">
    <h2>Chat</h2>
    <div className="messages">
      {messages.map((msg, index) => (
        <div key={index}>{msg}</div>
      ))}
    </div>
    <input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type a message..."
    />
    <button onClick={sendMessage}>Send</button>
  </div>
);

export default Chat;
