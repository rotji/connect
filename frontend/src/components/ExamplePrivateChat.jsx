import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import UserContext from './UserContext'; // Import UserContext

// Initialize the Socket.io client
const socket = io('http://localhost:5000'); // Replace with your server's address

const ExamplePrivateChat = ({ chatPartnerId }) => { // Removed `currentUserId` prop
  const { currentUserId } = useContext(UserContext); // Access `currentUserId` from context
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Debugging: Log currentUserId and chatPartnerId
  console.log('currentUserId:', currentUserId);
  console.log('chatPartnerId:', chatPartnerId);

  useEffect(() => {
    // Check if currentUserId and chatPartnerId are provided
    if (!currentUserId || !chatPartnerId) {
      console.error('Both senderId (currentUserId) and receiverId (chatPartnerId) are required.');
      return;
    }

    // Fetch existing messages from the server
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chats/messages/${currentUserId}/${chatPartnerId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Listen for incoming messages via Socket.io
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the effect
    return () => {
      socket.off('receiveMessage');
    };
  }, [currentUserId, chatPartnerId]);

  const handleSendMessage = () => {
    if (!currentUserId || !chatPartnerId) {
      console.error("Both senderId (currentUserId) and receiverId (chatPartnerId) are required.");
      return;
    }

    if (newMessage.trim() !== '') {
      const message = {  // Corrected message object declaration
        senderId: currentUserId,
        receiverId: chatPartnerId,
        message: newMessage,
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
            {msg.message}
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
