const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ 1. Search for users by name or phone number
router.get('/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },  // Case-insensitive search for name
        { phone: { $regex: query, $options: 'i' } }  // Case-insensitive search for phone
      ]
    });

    res.status(200).json(users);
  } catch (err) {
    console.error('❌ Error searching users:', err);
    res.status(500).json({ message: 'Error searching users', error: err.message });
  }
});

// ✅ 2. Add a new user
router.post('/', async (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: 'Name and phone are required' });
  }

  try {
    const newUser = new User({ name, phone });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', data: newUser });
  } catch (err) {
    console.error('❌ Error creating user:', err);
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

module.exports = router;
