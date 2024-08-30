import React, { useState, useContext } from 'react';
import axios from 'axios';
import './Login.css'; // Import the Login.css file
import UserContext from './UserContext'; // Import UserContext

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;
  const { setCurrentUserId } = useContext(UserContext); // Use setCurrentUserId from UserContext

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      const userId = response.data.user._id; // Get the logged-in user's ID
      console.log("User logged in, ID:", userId);

      setCurrentUserId(userId);  // Set current user ID in context
      alert('Login successful');

      // Redirect to profile page with user id
      window.location.href = `/profile/${userId}`;
    } catch (error) {
      const errorMsg = error.response && error.response.data && error.response.data.msg 
                        ? error.response.data.msg 
                        : 'An error occurred';
      alert('Error: ' + errorMsg);
      console.error(error.response ? error.response.data : error.message);
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    await loginUser(email, password);  // Call loginUser function
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input 
          type="email" 
          name="email" 
          value={email} 
          onChange={onChange} 
          placeholder="Email" 
          required 
        />
        <input 
          type="password" 
          name="password" 
          value={password} 
          onChange={onChange} 
          placeholder="Password" 
          required 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
