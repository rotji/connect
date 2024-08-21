const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const User = require('../models/User');
const logger = require('../logger'); // Winston logger

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// In-memory store for the currently logged-in user
let currentUser = null;

// Register new user
router.post('/register', async (req, res) => {
  const { name, email, password, category, details, phone, interest, expectation } = req.body;

  if (!name || !email || !password || !category || !details || !phone || !interest || !expectation) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password, category, details, phone, interest, expectation });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    logger.info(`User registered: ${user.id}`);

    res.json({ msg: 'User registered successfully', user });
  } catch (err) {
    logger.error(`Error during user registration: ${err.message}`);
    res.status(500).send('Server error');
  }
});

// Login user and set currentUser
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Set the currentUser to the logged-in user
    currentUser = user;

    logger.info(`User logged in: ${user.id}`);

    // Automatically return the user's profile upon successful login
    res.json({ msg: 'User logged in successfully', user });
  } catch (err) {
    logger.error(`Error during user login: ${err.message}`);
    res.status(500).send('Server error');
  }
});

// Get profile of the current logged-in user
router.get('/profile', async (req, res) => {
  if (!currentUser) {
    return res.status(401).json({ msg: 'No user is currently logged in' });
  }

  try {
    const user = await User.findById(currentUser.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'No user found' });
    }
    res.json(user);
  } catch (err) {
    logger.error(`Error fetching user profile: ${err.message}`);
    res.status(500).send('Server error');
  }
});

// Update user profile
router.put('/profile', upload.single('profilePicture'), async (req, res) => {
  const { name, email, category, details, phone, interest, expectation, password } = req.body;
  const profilePicture = req.file ? req.file.filename : null;

  if (!currentUser) {
    return res.status(401).json({ msg: 'No user is currently logged in' });
  }

  try {
    const user = await User.findById(currentUser.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (category) user.category = category;
    if (details) user.details = details;
    if (phone) user.phone = phone;
    if (interest) user.interest = interest;
    if (expectation) user.expectation = expectation;
    if (profilePicture) user.profilePicture = profilePicture;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ msg: 'Profile updated successfully', user });
  } catch (err) {
    logger.error(`Error updating user profile: ${err.message}`);
    res.status(500).send('Server error');
  }
});

// Fetch all unique interests
router.get('/interests', async (req, res) => {
  try {
    const interests = await User.distinct('interest');
    res.json(interests);
  } catch (err) {
    logger.error(`Error fetching interests: ${err.message}`);
    res.status(500).send('Server error');
  }
});

// Fetch all unique expectations
router.get('/expectations', async (req, res) => {
  try {
    const expectations = await User.distinct('expectation');
    res.json(expectations);
  } catch (err) {
    logger.error(`Error fetching expectations: ${err.message}`);
    res.status(500).send('Server error');
  }
});

// Search users by name, email, phone, interest, or expectation
router.get('/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ msg: 'Query parameter is required' });
  }

  try {
    // Perform a case-insensitive search across multiple fields
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },         // Search by name
        { email: { $regex: query, $options: 'i' } },        // Search by email
        { phone: { $regex: query, $options: 'i' } },        // Search by phone number
        { interest: { $regex: query, $options: 'i' } },     // Search by interest
        { expectation: { $regex: query, $options: 'i' } },  // Search by expectation
      ],
    }).select('-password');  // Exclude password from results

    res.json(users);
  } catch (err) {
    logger.error(`Error during user search: ${err.message}`);
    res.status(500).send('Server error');
  }
});

// Fetch all registered users
router.get('/all', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    logger.error(`Error fetching users: ${err.message}`);
    res.status(500).send('Server error');
  }
});

// Logout user and clear currentUser
router.post('/logout', (req, res) => {
  currentUser = null;
  res.json({ msg: 'User logged out successfully' });
});

module.exports = router;
