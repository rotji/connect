// src/components/UpdateProfile.jsx
import React, { useState } from 'react';
import axios from 'axios';

const UpdateProfile = ({ profile, setProfile, setIsEditing }) => {
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    category: profile.category,
    details: profile.details,
    profilePicture: null
  });

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onFileChange = e => setFormData({ ...formData, profilePicture: e.target.files[0] });

  const onSubmit = async e => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const res = await axios.put('http://localhost:5000/api/users/profile', data, config);
      setProfile(res.data.user);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={onChange} required />
      </div>
      <div>
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={onChange} required />
      </div>
      <div>
        <label>Phone</label>
        <input type="text" name="phone" value={formData.phone} onChange={onChange} required />
      </div>
      <div>
        <label>Category</label>
        <input type="text" name="category" value={formData.category} onChange={onChange} required />
      </div>
      <div>
        <label>Details</label>
        <textarea name="details" value={formData.details} onChange={onChange} required />
      </div>
      <div>
        <label>Profile Picture</label>
        <input type="file" name="profilePicture" onChange={onFileChange} />
      </div>
      <button type="submit">Update Profile</button>
      <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
    </form>
  );
};

export default UpdateProfile;

// Removed the duplicate import and export statement
