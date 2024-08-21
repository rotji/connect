import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import PostPage from './components/PostPage';
import Chat from './components/Chat';
import Search from './components/Search';
import RegisteredUsers from './components/RegisteredUsers';
import InterestList from './components/InterestList';
import ExpectationList from './components/ExpectationList';
import Navbar from './components/Navbar';
import Home from './components/Home'; 
import About from './components/About';
import UserProfilesByInterestOrExpectation from './components/UserProfilesByInterestOrExpectation';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

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
        <h1>Future Friends</h1>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/postpage" element={<PostPage />} />
        <Route path="/chat" element={<Chat messages={messages} message={message} setMessage={setMessage} sendMessage={sendMessage} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search />} />
        <Route path="/registered-users" element={<RegisteredUsers />} />
        <Route path="/interest-list" element={<InterestList />} />
        <Route path="/expectation-list" element={<ExpectationList />} />
        <Route path="/profiles" element={<UserProfilesByInterestOrExpectation />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
