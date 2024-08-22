import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
console.log('Socket URL:', socketUrl);

const socket = io(socketUrl);

const Chat = ({ currentUserId, chatPartnerId }) => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.emit('joinRoom', currentUserId);

    socket.on('privateMessage', (msg) => {
      setChat((prevChat) => [...prevChat, msg]);
    });

    return () => {
      socket.off('privateMessage');
    };
  }, [currentUserId]);

  const sendMessage = () => {
    socket.emit('privateMessage', {
      senderId: currentUserId,
      receiverId: chatPartnerId,
      message,
    });
    setChat((prevChat) => [...prevChat, { senderId: currentUserId, message }]);
    setMessage('');
  };

  return (
    <div>
      <h2>Private Chat</h2>
      <div>
        {chat.map((msg, index) => (
          <div key={index}>
            <strong>{msg.senderId === currentUserId ? 'You' : 'Them'}:</strong> {msg.message}
          </div>
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
