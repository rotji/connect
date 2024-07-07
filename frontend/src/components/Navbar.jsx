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
        <li><Link to="/posts">Posts</Link></li>
        <li><Link to="/chat">Chat</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
        <Link to="/directory">Directory</Link>
      </ul>
    </nav>
  );
};

export default Navbar;
