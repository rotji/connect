import React from 'react';

const UserProfile = ({ user }) => {
  return (
    <div>
      <h2>{user.name}</h2>
      {user.profilePicture ? (  // Adjusted to match the property name in your user model
        <img src={`/uploads/${user.profilePicture}`} alt={`${user.name}'s Profile`} width="100" />
      ) : (
        <img src="/default-profile.png" alt="Default Profile" width="100" />
      )}
    </div>
  );
};

export default UserProfile;
