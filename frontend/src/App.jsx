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
import ErrorBoundary from './components/ErrorBoundary';
import io from 'socket.io-client';

// Sentry integration
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

const socket = io('http://localhost:5000');

// Initialize Sentry
Sentry.init({
  dsn: "https://fe936dcf2f8072f9774a769e59f24a32@o4507832110415872.ingest.us.sentry.io/4507833717620736", // Your actual Sentry DSN URL
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0, // Adjust the sample rate based on your needs
});

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
        <Route
          path="/profile"
          element={
            <ErrorBoundary>
              <Profile />
            </ErrorBoundary>
          }
        />
        <Route
          path="/postpage"
          element={
            <ErrorBoundary>
              <PostPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/chat"
          element={
            <ErrorBoundary>
              <Chat messages={messages} message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </ErrorBoundary>
          }
        />
        <Route
          path="/register"
          element={
            <ErrorBoundary>
              <Register />
            </ErrorBoundary>
          }
        />
        <Route
          path="/login"
          element={
            <ErrorBoundary>
              <Login />
            </ErrorBoundary>
          }
        />
        <Route
          path="/search"
          element={
            <ErrorBoundary>
              <Search />
            </ErrorBoundary>
          }
        />
        <Route
          path="/registered-users"
          element={
            <ErrorBoundary>
              <RegisteredUsers />
            </ErrorBoundary>
          }
        />
        <Route
          path="/interest-list"
          element={
            <ErrorBoundary>
              <InterestList />
            </ErrorBoundary>
          }
        />
        <Route
          path="/expectation-list"
          element={
            <ErrorBoundary>
              <ExpectationList />
            </ErrorBoundary>
          }
        />
        <Route
          path="/profiles"
          element={
            <ErrorBoundary>
              <UserProfilesByInterestOrExpectation />
            </ErrorBoundary>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default Sentry.withProfiler(App); // Wrap the App component with Sentry's Profiler
