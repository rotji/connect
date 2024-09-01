const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  interest: {
    type: String,
    required: true,
  },
  expectation: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
});

// Check if the model is already compiled, and only define it if it's not
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
