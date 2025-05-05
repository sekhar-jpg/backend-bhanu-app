const express = require('express');
const router = express.Router();
const Case = require('../models/Case');  // Assuming your Case model is defined

// POST route to add new case
router.post('/add', async (req, res) => {
  try {
    const newCase = new Case(req.body);  // Assuming req.body has the correct case data
    await newCase.save();  // Save the case data to the database
    res.status(201).json({ success: true, message: 'Case added successfully' });
  } catch (err) {
    console.error('Error adding case:', err);
    res.status(400).json({ success: false, message: 'Error adding case' });
  }
});

// GET route to fetch all cases (for testing)
router.get('/', async (req, res) => {
  try {
    const cases = await Case.find();  // Fetch all cases from the database
    res.json(cases);
  } catch (err) {
    console.error('Error fetching cases:', err);
    res.status(500).json({ message: 'Error fetching cases' });
  }
});

module.exports = router;
