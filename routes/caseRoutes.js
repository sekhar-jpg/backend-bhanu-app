const express = require('express');
const router = express.Router();
const Case = require('../models/Case');

// ✅ POST: Add a new case
router.post('/add', async (req, res) => {
  try {
    const newCase = new Case(req.body);
    await newCase.save();
    res.status(201).json({ message: 'Case added successfully' });
  } catch (err) {
    console.error('Error adding case:', err);
    res.status(500).json({ message: 'Error adding case' });
  }
});

// ✅ GET: Fetch follow-up cases
router.get('/follow-ups', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset to start of day

    const followUps = await Case.find({
      followUpDate: { $lte: today }
    });

    res.json(followUps);
  } catch (err) {
    console.error('Error fetching follow-ups:', err);
    res.status(500).json({ message: 'Error fetching follow-ups' });
  }
});

module.exports = router;
