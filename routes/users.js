const express = require('express');
const User = require('../models/user');

const router = express.Router();

// Get users or a specific user by email
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    if (email) {
      const user = await User.findOne({ email });
      return user ? res.json(user) : res.status(404).json({ message: 'User not found' });
    }
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update a user
router.post('/', async (req, res) => {
  try {
    const { email, name } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (user) {
      // If user exists, update their information if needed (e.g., name)
      user.name = name || user.name; // Update other fields if necessary
      await user.save();
      return res.status(200).json({ message: 'User updated successfully', user });
    }

    // If user doesn't exist, create a new one
    user = await User.create(req.body);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
