// routes/team.js
const express = require('express');
const router = express.Router();
const Team = require('../models/team');
const User = require('../models/user'); // Assuming you have a User model

// Create a new team
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const newTeam = new Team({ name, description });
    const savedTeam = await newTeam.save();
    res.status(201).json(savedTeam);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Failed to create team.' });
  }
});

// Get all teams
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find().populate('members', 'name email'); // Populate members with their names and emails
    res.status(200).json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams.' });
  }
});

// Join a team
router.post('/join/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.user._id;  // Assuming user is authenticated and `req.user` contains the user's info

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found.' });
    }

    if (!team.members.includes(userId)) {
      team.members.push(userId);
      await team.save();
      res.status(200).json({ message: 'Successfully joined the team.' });
    } else {
      res.status(400).json({ error: 'You are already a member of this team.' });
    }
  } catch (error) {
    console.error('Error joining team:', error);
    res.status(500).json({ error: 'Failed to join the team.' });
  }
});

module.exports = router;
