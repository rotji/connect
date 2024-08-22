import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import UpdateProfile from './UpdateProfile';
import Modal from './Modal'; // Import the Modal component
import ExamplePrivateChat from './ExamplePrivateChat'; // Import the ExamplePrivateChat component
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/profile');
        setProfile(res.data);
      } catch (err) {
        const errorMsg = err.response ? err.response.data.msg : err.message;
        setError(`Failed to fetch profile data: ${errorMsg}`);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileUpdate = useCallback((updatedProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false); // Close the modal after updating the profile
  }, []);

  const handleLogout = () => {
    window.location.reload(); // Simple reload for logout
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  const currentUserId = profile._id; // Assuming the profile being viewed belongs to the current user
  const chatPartnerId = "someUserId"; // Replace this with the ID of the user you want to chat with

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

      {/* Modal for editing the profile */}
      {isEditing && (
        <Modal onClose={() => setIsEditing(false)}>
          <UpdateProfile profile={profile} setProfile={handleProfileUpdate} />
        </Modal>
      )}

      {/* ExamplePrivateChat component for private messaging */}
      <div className="private-chat-container">
        <h3>Private Chat</h3>
        <ExamplePrivateChat currentUserId={currentUserId} chatPartnerId={chatPartnerId} />
      </div>
    </div>
  );
};

export default Profile;
