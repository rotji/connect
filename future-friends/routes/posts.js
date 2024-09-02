const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// Create a post
router.post('/', async (req, res) => {
  console.log(req.body);
  const { userId, content } = req.body;

  try {
    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid user' });
    }

    const newPost = new Post({
      user: user._id,
      content: content.trim(),
      date: Date.now(), // Ensure the date is set when creating the post
    });

    const savedPost = await newPost.save();

    // Populate the user's profile information including country, state, town, and address
    const populatedPost = await savedPost.populate('user', 'name email number category interest expectation country state town address').execPopulate();
    res.status(201).json(populatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name email number category interest expectation country state town address')
      .sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'name email number category interest expectation country state town address');

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// Update a post
router.put('/:id', async (req, res) => {
  const { title, content } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.date = Date.now(); // Update the date when the post is edited

    await post.save();

    // Populate the user's profile information after updating the post, including the new fields
    const populatedPost = await post.populate('user', 'name email number category interest expectation country state town address').execPopulate();
    res.json(populatedPost);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
