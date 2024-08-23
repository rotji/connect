import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios'; // Import axios for fetching messages

const socket = io('http://localhost:5000'); // Replace with your server's address

const ExamplePrivateChat = ({ currentUserId, chatPartnerId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Fetch existing messages from the server
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/messages/${currentUserId}/${chatPartnerId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Listen for incoming messages via Socket.io
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the effect
    return () => {
      socket.off('message');
    };
  }, [currentUserId, chatPartnerId]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const message = {
        senderId: currentUserId,
        receiverId: chatPartnerId,
        content: newMessage,
      };

      // Emit the message to the server via Socket.io
      socket.emit('sendMessage', message);

      // Optionally, update local state to display the message instantly
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage('');
    }
  };

  return (
    <div>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.senderId === currentUserId ? 'sent' : 'received'}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ExamplePrivateChat;
