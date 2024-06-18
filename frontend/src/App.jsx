// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import PostList from './components/PostList';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []); 

  useEffect(() => { 
    // Listen for messages from the server
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup function
    return () => {
      socket.off('receiveMessage');
    };
  }, []); 

  const sendMessage = () => {
    socket.emit('sendMessage', message);
    setMessage('');
  };

  return (
    <div className="App">
      <h1>Future Friends</h1>
      {!token ? (
        <>
          <Register />
          <Login setToken={setToken} /> 
        </>
      ) : (
       <>
          <Profile />
          <PostList />
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
          </div> {/* Correctly close the chat div */}
        </>
      )}
    </div>
  );
}

export default App;
