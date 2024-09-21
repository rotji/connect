import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import UpdateProfile from './UpdateProfile';
import Modal from './Modal'; // Import the Modal component
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

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      
      {/* Profile details section with new fields */}
      <div className="profile-detail">
        <span className="profile-label">Name:</span>
        <span className="profile-value">{profile.name}</span>
      </div>

      <div className="profile-detail">
        <span className="profile-label">Email:</span>
        <span className="profile-value">{profile.email}</span>
      </div>

      <div className="profile-detail">
        <span className="profile-label">Phone:</span>
        <span className="profile-value">{profile.phone}</span>
      </div>

      <div className="profile-detail">
        <span className="profile-label">Category:</span>
        <span className="profile-value">{profile.category}</span>
      </div>

      <div className="profile-detail">
        <span className="profile-label">Interest:</span>
        <span className="profile-value">{profile.interest}</span> {/* New field for interest */}
      </div>

      <div className="profile-detail">
        <span className="profile-label">Expectation:</span>
        <span className="profile-value">{profile.expectation}</span> {/* New field for expectation */}
      </div>

      <div className="profile-detail">
        <span className="profile-label">Country:</span>
        <span className="profile-value">{profile.country}</span> {/* New field for country */}
      </div>

      <div className="profile-detail">
        <span className="profile-label">State:</span>
        <span className="profile-value">{profile.state}</span> {/* New field for state */}
      </div>

      <div className="profile-detail">
        <span className="profile-label">Town:</span>
        <span className="profile-value">{profile.town}</span> {/* New field for town */}
      </div>

      <div className="profile-detail">
        <span className="profile-label">Address:</span>
        <span className="profile-value">{profile.address}</span> {/* New field for address */}
      </div>

      <div className="profile-detail">
        <span className="profile-label">Details:</span>
        <span className="profile-value">{profile.details}</span> {/* "Details" moved to the last position */}
      </div>

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
    </div>
  );
};

export default Profile;
