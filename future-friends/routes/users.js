const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const auth = require('../middleware/auth');
const logger = require('../logger'); // Winston logger

const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || 'yourSecretKey';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Helper function to generate JWT
const generateToken = (user) => {
  const payload = { user: { id: user.id } };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: 3600 });
};

// Register new user
router.post('/register', async (req, res) => {
  const { name, email, password, category, details, phone, interest, expectation } = req.body;

  if (!name || !email || !password || !category || !details || !phone || !interest || !expectation) {
    logger.error('Registration failed: Missing fields');
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      logger.error(`Registration failed: User already exists (${email})`);
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password, category, details, phone, interest, expectation });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    logger.info(`User registered: ${user.id}`);

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    logger.error(`Error during user registration: ${err.message}`);
    res.status(500).send('Server error');
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.error('Login failed: Missing fields');
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      logger.error(`Login failed: Invalid credentials (${email})`);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.error(`Login failed: Invalid credentials (${email})`);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    logger.info(`User logged in: ${user.id}`);

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    logger.error(`Error during user login: ${err.message}`);
    res.status(500).send('Server error');
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    logger.error(`Error fetching user profile: ${err.message}`);
    res.status(500).send('Server error');
  }
});

// Update user profile
router.put('/profile', auth, upload.single('profilePicture'), async (req, res) => {
  const { name, email, category, details, phone, interest, expectation, password } = req.body;
  const profilePicture = req.file ? req.file.filename : null;

  try {
    const user = await User.findById(req.user.id);

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

// Route to get all registered users
router.get('/all', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password field
    res.json(users);
  } catch (err) {
    logger.error(`Error fetching users: ${err.message}`);
    res.status(500).send('Server error');
  }
});

module.exports = router;
