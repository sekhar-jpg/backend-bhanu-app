// routes/followUpRoutes.js

const express = require('express');
const router = express.Router();
const FollowUp = require('../models/FollowUp');

// Update a follow-up by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedFollowUp = await FollowUp.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFollowUp) return res.status(404).json({ message: 'Follow-up not found' });
    res.json(updatedFollowUp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
