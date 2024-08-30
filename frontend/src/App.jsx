import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import { UserProvider } from './components/UserContext'; // Import UserProvider

function App() {
  const [currentUserId, setCurrentUserId] = useState(null);  // State to store current user's ID
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // Track if user is logged in

  // Function to log in the user
  const loginUser = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      setCurrentUserId(response.data.user._id);  // Assuming response contains the user ID
      setIsAuthenticated(true);  // Mark user as authenticated
    } catch (error) {
      console.error('Failed to log in:', error);
    }
  };

  // Fetch user profile after login and set `currentUserId`
  useEffect(() => {
    if (isAuthenticated) {  // Fetch only if authenticated
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/users/profile');
          setCurrentUserId(response.data._id); // Assume the user profile API returns the user ID as `_id`
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      };

      fetchUserProfile();
    }
  }, [isAuthenticated]); // Re-fetch if `isAuthenticated` changes

  return (
    <UserProvider> {/* Wrap your app with UserProvider */}
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
                <Profile currentUserId={currentUserId} />
              </ErrorBoundary>
            }
          />
          <Route
            path="/postpage"
            element={
              <ErrorBoundary>
                <PostPage currentUserId={currentUserId} />
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
                <Login setCurrentUserId={setCurrentUserId} />  {/* Pass setCurrentUserId to Login component */}
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
          path="/teams"
          element={
            <ErrorBoundary>
              <Teams />  
            </ErrorBoundary>
          }
        />
          <Route
            path="/example-private-chat"
            element={
              <ErrorBoundary>
                <ExamplePrivateChat currentUserId={currentUserId} chatPartnerId={"someUserId"} />
                {/* Log the userId passed */}
                {console.log("Passing currentUserId to ExamplePrivateChat:", currentUserId)}
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
    </UserProvider>
  );
}

export default App;
