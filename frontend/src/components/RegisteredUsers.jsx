import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './RegisteredUsers.css';

const RegisteredUsers = ({ setChatPartnerEmail }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChat, setActiveChat] = useState(null); // To track which chat is active
  const [chatMessage, setChatMessage] = useState(''); // Message state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/all');
        const sortedUsers = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUsers(sortedUsers);
        setLoading(false);
      } catch (error) {
        setError('Error fetching users: ' + error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const handleStartChat = (email) => {
    setChatPartnerEmail(email);
    setActiveChat(email); // Set the active chat to the selected user
    navigate(`/private-chat/${email}`);
  };

  const handleSendMessage = () => {
    // Handle sending the message
    console.log(`Message sent: ${chatMessage}`);
    setChatMessage(''); // Clear the message after sending
  };

  return (
    <div className="registered-users-container">
      <h2>Registered Users</h2>
      {error && <p className="error">{error}</p>}
      <ul className="registered-users-list">
        {users.map(user => (
          <li key={user._id} className="registered-users-item">
            <p><span>Name:</span> {user.name}</p>
            <p><span>Email:</span> {user.email}</p>
            <p><span>Category:</span> {user.category}</p>
            <p><span>Details:</span> {user.details}</p>
            <p><span>Phone:</span> {user.phone}</p>
            <p><span>Interest:</span> {user.interest}</p>
            <p><span>Expectation:</span> {user.expectation}</p>
            <button onClick={() => handleStartChat(user.email)}>Start Chat</button>

            {/* Show chat input only if this is the active chat */}
            {activeChat === user.email && (
              <div>
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="chat-input"
                  placeholder="Type your message"
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegisteredUsers;
