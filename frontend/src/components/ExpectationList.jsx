import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExpectationList = () => {
  const [expectations, setExpectations] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpectations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/expectations');
        setExpectations(response.data);
      } catch (error) {
        setError('Error fetching expectations');
        console.error('Error fetching expectations:', error);
      }
    };

    fetchExpectations();
  }, []);

  const handleExpectationClick = (expectation) => {
    navigate(`/profiles?expectation=${encodeURIComponent(expectation)}`);
  };

  return (
    <div>
      <h2>Expectation List</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {expectations.map((expectation, index) => (
            <li key={index} onClick={() => handleExpectationClick(expectation)}>
              {expectation}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpectationList;
