import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo-title">
        <img src="/images/logo.png" className="navbar-logo" alt="FutureFriends Logo" />
        <span className="navbar-title">FutureFriends</span>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/profile">Profile</Link></li> 
        <li><Link to="/postpage">Posts</Link></li>
        <Link to="/example-private-chat">Private Chat</Link>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/search">Search</Link></li>
        <li><Link to="/teams">Teams</Link></li>
        <li><Link to="/registered-users">Registered Users</Link></li> 
        <Link to="/interest-list">Interest List</Link>
        <Link to="/expectation-list">Expectation List</Link>
        <li><Link to="/notifications">Notifications</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/payment-form">Payment Form</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
