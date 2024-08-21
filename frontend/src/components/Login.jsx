import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Import the Login.css file

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      alert('Login successful');
      
      // Redirect to profile page with user id
      const userId = response.data.user._id;
      window.location.href = `/profile/${userId}`;
    } catch (err) {
      const errorMsg = err.response && err.response.data && err.response.data.msg 
                        ? err.response.data.msg 
                        : 'An error occurred';
      alert('Error: ' + errorMsg);
      console.error(err.response ? err.response.data : err.message);
    }
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
