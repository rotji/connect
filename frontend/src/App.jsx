import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Import Routes and Route
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import PostList from './components/PostList';
import Chat from './components/Chat';
import Navbar from './components/Navbar'; // Ensure this import is correct
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
      <Navbar />
      <header>
        <h1>Future Friends</h1> {/* Retain the h1 tag if it's necessary */}
      </header>
      <Routes>
        {!token ? (
          <>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/register" element={<Register setToken={setToken} />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Profile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/chat" element={<Chat messages={messages} message={message} setMessage={setMessage} sendMessage={sendMessage} />} />
          </>
        )}
        {/* Fallback for unmatched routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
