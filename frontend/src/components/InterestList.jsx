import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InterestList = () => {
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/interests');
        setInterests(response.data);
      } catch (error) {
        setError('Error fetching interests');
        console.error('Error fetching interests:', error);
      }
    };

    fetchInterests();
  }, []);

  const handleInterestClick = (interest) => {
    navigate(`/profiles?interest=${encodeURIComponent(interest)}`);
  };

  return (
    <div>
      <h2>Interest List</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {interests.map((interest, index) => (
            <li key={index} onClick={() => handleInterestClick(interest)}>
              {interest}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InterestList;
