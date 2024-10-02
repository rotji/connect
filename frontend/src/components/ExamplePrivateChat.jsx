import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const ExamplePrivateChat = ({ currentUserEmail, chatPartnerEmail }) => {
  const [messages, setMessages] = useState([]); // Initialize as an empty array
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish Socket.io connection
    const socketInstance = io('http://localhost:5000');
    setSocket(socketInstance);

    // Listen for incoming messages
    socketInstance.on('receive-message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Join room using a combination of both emails
    if (currentUserEmail && chatPartnerEmail) {
      const room = [currentUserEmail, chatPartnerEmail].sort().join('-'); // Create unique room name
      socketInstance.emit('join-room', { email: currentUserEmail, room });
      console.log(`User with email ${currentUserEmail} joined room ${room}`);
    } else {
      console.log('Invalid email: User or chatPartnerEmail is missing.');
    }

    // Cleanup on component unmount or when switching users
    return () => {
      socketInstance.disconnect();
      setMessages([]); // Clear chat messages when switching chat partners
    };
  }, [currentUserEmail, chatPartnerEmail]);

  const sendMessage = () => {
    if (newMessage.trim() && currentUserEmail && chatPartnerEmail) {
      const room = [currentUserEmail, chatPartnerEmail].sort().join('-'); // Ensure the message goes to the correct room
      const message = {
        sender: currentUserEmail,
        content: newMessage,
        room,
        timestamp: new Date(),
      };
      socket.emit('send-message', message);
      setMessages((prevMessages) => [...prevMessages, message]); // Update messages locally
      setNewMessage(''); // Clear the input field
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '400px', border: '1px solid #ccc' }}>
      <h2>Private Chat with {chatPartnerEmail}</h2>
      <div
        className="chat-window"
        style={{
          flex: 1,
          overflowY: 'auto',
          border: '1px solid #ddd',
          padding: '10px',
          marginBottom: '10px',
        }}
      >
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className={msg.sender === currentUserEmail ? 'my-message' : 'partner-message'}>
              <strong>{msg.sender}:</strong> {msg.content}
              <small> {new Date(msg.timestamp).toLocaleString()}</small>
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: '10px', fontSize: '16px' }}
        />
        <button
          onClick={sendMessage}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ExamplePrivateChat;
