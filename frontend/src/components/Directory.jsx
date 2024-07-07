// src/components/Directory.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Directory.css';

const Directory = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch the list of users from the backend
    axios.get('/api/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="directory-container">
      <h2>Directory</h2>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="directory-search"
      />
      <ul className="directory-list">
        {filteredUsers.map(user => (
          <li key={user.id} className="directory-item">
            <p>{user.name}</p>
            <p>{user.department || user.type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Directory;
