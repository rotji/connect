// src/components/UserProfilesByInterestOrExpectation.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const UserProfilesByInterestOrExpectation = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const interest = query.get('interest');
    const expectation = query.get('expectation');

    const fetchProfiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profiles', {
          params: { interest, expectation },
        });
        setProfiles(response.data);
      } catch (error) {
        setError('Error fetching profiles');
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, [location.search]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profiles.length) {
    return <div>No profiles found.</div>;
  }

  return (
    <div>
      <h2>User Profiles</h2>
      <ul>
        {profiles.map((profile) => (
          <li key={profile._id}>
            <p>Name: {profile.name}</p>
            <p>Email: {profile.email}</p>
            <p>Phone: {profile.phone}</p>
            {/* Add more profile details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfilesByInterestOrExpectation;
