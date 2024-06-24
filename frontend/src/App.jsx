// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login'; // Ensure this import is correct
import Profile from './components/Profile';
import Chat from './components/Chat'; // Ensure this import is correct
import io from 'socket.io-client';
import logo from '../public/images/logo.png'; // Correct path to your logo

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
      <header>
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Future Friends</h1>
      </header>
      {!token ? (
        <>
          <Register />
          <Login setToken={setToken} /> {/* Correct import used here */}
        </>
      ) : (
        <>
          <Profile />
          <Chat messages={messages} message={message} setMessage={setMessage} sendMessage={sendMessage} /> {/* Correct import used here */}
        </>
      )}
    </div>
  );
}

export default App;
