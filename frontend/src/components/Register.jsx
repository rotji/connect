import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'; // Ensure this import is correct

const Register = ({ setToken }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { name, email, password, confirmPassword } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', formData);
      const token = res.data.token;
      localStorage.setItem('token', token);
      setToken(token); 
      alert('Registration successful');
    } catch (err) {
      const errorMsg = err.response && err.response.data && err.response.data.msg 
                        ? err.response.data.msg 
                        : 'An error occurred';
      alert('Error: ' + errorMsg);
      console.error(err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <input type="text" name="name" value={name} onChange={onChange} placeholder="Name" required />
        <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
        <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
        <input type="password" name="confirmPassword" value={confirmPassword} onChange={onChange} placeholder="Confirm Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
