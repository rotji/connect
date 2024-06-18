// src/components/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    category: '',
    details: ''
  });

  const { name, email, password, category, details } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    console.log('Form submitted', formData); // Debug log
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', formData);
      console.log('Success:', res.data); // Debug log
      alert('User registered successfully');
    } catch (err) {
      const errorMsg = err.response && err.response.data && err.response.data.msg 
                        ? err.response.data.msg 
                        : 'An error occurred';
      alert('Error: ' + errorMsg);
      console.error('Error:', err.response ? err.response.data : err.message); // Debug log
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" value={name} onChange={onChange} placeholder="Name" required />
      <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
      <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
      <input type="text" name="category" value={category} onChange={onChange} placeholder="Category" required />
      <input type="text" name="details" value={details} onChange={onChange} placeholder="Details" required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
