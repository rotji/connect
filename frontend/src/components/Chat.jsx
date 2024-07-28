// src/components/Chat.jsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
console.log('Socket URL:', socketUrl);

const socket = io(socketUrl);

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {    socket.on('chatMessage', (msg) => {
      setChat((prevChat) => [...prevChat, msg]);
    });

    return () => {
      socket.off('chatMessage');
    };
  }, []);

  const sendMessage = () => {
    socket.emit('chatMessage', message);
    setMessage('');
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {chat.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input 
        type="text" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="Type a message" 
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;

// Removed the duplicate import and Chat component definition
