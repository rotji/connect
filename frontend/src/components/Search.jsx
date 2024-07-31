import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Search.css';

const Search = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all users
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/all');
        setUsers(response.data);
      } catch (error) {
        setError('Error fetching users');
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const nameMatches = user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatches = user.category && user.category.toLowerCase().includes(searchTerm.toLowerCase());
    const detailsMatches = user.details && user.details.toLowerCase().includes(searchTerm.toLowerCase());
    const interestMatches = user.interest && user.interest.toLowerCase().includes(searchTerm.toLowerCase());
    const expectationMatches = user.expectation && user.expectation.toLowerCase().includes(searchTerm.toLowerCase());

    return nameMatches || categoryMatches || detailsMatches || interestMatches || expectationMatches;
  });

  return (
    <div className="search-container">
      <h2>Search Users</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Search by name, category, details, interest, or expectation"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <ul className="search-results-list">
        {filteredUsers.map(user => (
          <li key={user._id} className="search-results-item">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Category:</strong> {user.category}</p>
            <p><strong>Details:</strong> {user.details}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Interest:</strong> {user.interest}</p>
            <p><strong>Expectation:</strong> {user.expectation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
