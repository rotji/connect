import React from 'react';
import './Modal.css';

const Modal = ({ show, onClose, profile }) => {
  if (!show || !profile) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{profile.name ? profile.name : 'Unknown'}'s Profile</h2>
        <p><strong>Email:</strong> {profile.email ? profile.email : 'Not provided'}</p>
        <p><strong>Number:</strong> {profile.number ? profile.number : 'Not provided'}</p>
        <p><strong>Category:</strong> {profile.category ? profile.category : 'Not provided'}</p>
        <p><strong>Interest:</strong> {profile.interest ? profile.interest : 'Not provided'}</p>
        <p><strong>Expectation:</strong> {profile.expectation ? profile.expectation : 'Not provided'}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
