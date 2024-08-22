import React from 'react';
import './Modal.css';

const Modal = ({ show, onClose, profile }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{profile.name}'s Profile</h2>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Number:</strong> {profile.number}</p>
        <p><strong>Category:</strong> {profile.category}</p>
        <p><strong>Interest:</strong> {profile.interest}</p>
        <p><strong>Expectation:</strong> {profile.expectation}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
