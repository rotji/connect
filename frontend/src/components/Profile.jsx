import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UpdateProfile from './UpdateProfile';
import CreatePost from './CreatePost';
import PostList from './PostList';
import './Profile.css'; // Import the CSS file

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Log the token
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/users/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('Profile Response:', res.data);
          setProfile(res.data);
        } catch (err) {
          const errorMsg = err.response ? err.response.data.msg : err.message;
          setError(`Failed to fetch profile data: ${errorMsg}`);
          console.error(err);
        }
      } else {
        setError('No token found');
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>
      <p>Phone: {profile.phone}</p>
      <p>Category: {profile.category}</p>
      <p>Details: {profile.details}</p>
      {profile.profilePicture && (
        <img
          src={`http://localhost:5000/uploads/${profile.profilePicture}`}
          alt="Profile"
          className="profile-picture"
        />
      )}
      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => setIsEditing(true)}>Edit Profile</button>
      {isEditing && (
        <UpdateProfile profile={profile} setProfile={handleProfileUpdate} setIsEditing={setIsEditing} />
      )}
      <CreatePost onCreatePost={handleProfileUpdate} />
      <PostList />
    </div>
  );
};

export default Profile;
