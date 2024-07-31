import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RegisteredUsers.css';

const RegisteredUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/all');
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching users: ' + error.message);
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();

    // Cleanup function to avoid setting state on unmounted component
    return () => {
      setLoading(false);
      setError(null);
    };
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="registered-users-container">
      <h2>Registered Users</h2>
      {error && <p className="error">{error}</p>}
      <ul className="registered-users-list">
        {users.map(user => (
          <li key={user._id} className="registered-users-item">
            <p><span>Name:</span> {user.name}</p>
            <p><span>Email:</span> {user.email}</p>
            <p><span>Category:</span> {user.category}</p>
            <p><span>Details:</span> {user.details}</p>
            <p><span>Phone:</span> {user.phone}</p>
            <p><span>Interest:</span> {user.interest}</p>
            <p><span>Expectation:</span> {user.expectation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegisteredUsers;
