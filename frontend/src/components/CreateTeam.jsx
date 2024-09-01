import React, { useState } from 'react';
import axios from 'axios';
import './CreateTeam.css';

const CreateTeam = ({ onCreateTeam }) => {
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/teams', {
        name: teamName,
        description: teamDescription,
      });
      onCreateTeam(response.data);
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Failed to create team.');
    }
  };

  return (
    <form className="create-team-form" onSubmit={handleSubmit}>
      <h3>Create a New Team</h3>
      <input
        type="text"
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        required
      />
      <textarea
        placeholder="Team Description"
        value={teamDescription}
        onChange={(e) => setTeamDescription(e.target.value)}
        required
      />
      <button type="submit">Create Team</button>
    </form>
  );
};

export default CreateTeam;
