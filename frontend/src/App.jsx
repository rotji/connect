import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import PostPage from './components/PostPage';
import ExamplePrivateChat from './components/ExamplePrivateChat';
import Search from './components/Search';
import RegisteredUsers from './components/RegisteredUsers';
import InterestList from './components/InterestList';
import ExpectationList from './components/ExpectationList';
import Teams from './components/Teams';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import UserProfilesByInterestOrExpectation from './components/UserProfilesByInterestOrExpectation';
import ErrorBoundary from './components/ErrorBoundary';
import axios from 'axios';
import { UserProvider } from './components/UserContext';
import Notifications from './components/Notifications';
import ProfilePictureUpload from './components/ProfilePictureUpload';
import UserProfile from './components/UserProfile';
import PaymentForm from './components/PaymentForm';

function App() {
  const [currentUserEmail, setCurrentUserEmail] = useState(null);  // State to store current user's email
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // Track if user is logged in
  const [chatPartnerEmail, setChatPartnerEmail] = useState('');  // State to store chat partner's email

  // Function to log in the user
  const loginUser = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      setCurrentUserEmail(response.data.user.email);  // Ensure user email is correctly set after login
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to log in:', error);
    }
  };

  // Fetch user profile after login and set `currentUserEmail`
  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/users/profile');
          setCurrentUserEmail(response.data.email);  // Set user email after fetching profile
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      };

      fetchUserProfile();
    }
  }, [isAuthenticated]);

  return (
    <UserProvider> {/* Wrap the app with UserProvider */}
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
                <Profile currentUserEmail={currentUserEmail} />
              </ErrorBoundary>
            }
          />
          <Route
            path="/postpage"
            element={
              <ErrorBoundary>
                <PostPage currentUserEmail={currentUserEmail} />
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
                <Login setCurrentUserEmail={setCurrentUserEmail} />
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
                <RegisteredUsers setChatPartnerEmail={setChatPartnerEmail} />
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
            path="/teams"
            element={
              <ErrorBoundary>
                <Teams />
              </ErrorBoundary>
            }
          />
          
          {/* Private chat route dynamically accepts chatPartnerEmail via URL parameter */}
          <Route
            path="/private-chat/:chatPartnerEmail"
            element={
              <ErrorBoundary>
                <PrivateChatWrapper currentUserEmail={currentUserEmail} />
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
          <Route
            path="/notifications"
            element={
              <ErrorBoundary>
                <Notifications currentUserEmail={currentUserEmail} />
              </ErrorBoundary>
            }
          />
          <Route
            path="/upload-profile-picture"
            element={
              <ErrorBoundary>
                <ProfilePictureUpload />
              </ErrorBoundary>
            }
          />
          <Route
            path="/user-profile/:userId"
            element={
              <ErrorBoundary>
                <UserProfile />
              </ErrorBoundary>
            }
          />
          <Route
            path="/payment"  
            element={
              <ErrorBoundary>
                <PaymentForm />
              </ErrorBoundary>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </UserProvider>
  );
}

// Wrapper component to extract chatPartnerEmail from URL parameters and pass it to ExamplePrivateChat
function PrivateChatWrapper({ currentUserEmail }) {
  const { chatPartnerEmail } = useParams();

  return (
    <ExamplePrivateChat currentUserEmail={currentUserEmail} chatPartnerEmail={chatPartnerEmail} />
  );
}

export default App;
