// src/components/UpdateProfile.jsx
import React, { useState } from 'react';
import axios from 'axios';

const UpdateProfile = ({ profile, setProfile, setIsEditing }) => {
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    category: profile.category,
    details: profile.details, 
    password: ''
  });

  const { name, email, category, details, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await axios.put('http://localhost:5000/api/users/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Profile updated successfully');
      setProfile(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('Failed to update profile');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Update Profile</h2>
      <input type="text" name="name" value={name} onChange={onChange} placeholder="Name" required />
      <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
      <input type="password" name="password" value={password} onChange={onChange} placeholder="New Password (Optional)" />
      <input type="text" name="category" value={category} onChange={onChange} placeholder="Category" required />
      <input type="text" name="details" value={details} onChange={onChange} placeholder="Details" required />
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default UpdateProfile;
