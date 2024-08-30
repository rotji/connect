import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateTeam from './CreateTeam'; // Assuming you have a CreateTeam component
import './Teams.css';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [showCreateTeam, setShowCreateTeam] = useState(false);

  useEffect(() => {
    // Fetch all teams from the server
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/teams'); // Adjust the URL to match your backend
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  const handleCreateTeam = (newTeam) => {
    setTeams([...teams, newTeam]);
    setShowCreateTeam(false);
  };

  const handleJoinTeam = async (teamId) => {
    try {
      // Make an API request to join the team
      await axios.post(`http://localhost:5000/api/teams/join/${teamId}`);
      alert('You have successfully joined the team!');
    } catch (error) {
      console.error('Error joining team:', error);
      alert('Failed to join the team.');
    }
  };

  return (
    <div className="teams-container">
      <h2>Teams</h2>
      <button onClick={() => setShowCreateTeam(true)}>Create Team</button>
      {showCreateTeam && <CreateTeam onCreateTeam={handleCreateTeam} />}
      <div className="team-list">
        {teams.map((team) => (
          <div key={team._id} className="team-item">
            <h3>{team.name}</h3>
            <p>{team.description}</p>
            <button onClick={() => handleJoinTeam(team._id)}>Join Team</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teams;
