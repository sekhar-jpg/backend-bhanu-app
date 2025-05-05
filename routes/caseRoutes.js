// routes/caseRoutes.js
const express = require('express');
const router = express.Router();
const Case = require('../models/Case');

// POST: Add a new case
router.post('/add', async (req, res) => {
  try {
    const newCase = new Case(req.body);
    await newCase.save();
    res.status(200).json({ success: true, message: 'Case added successfully' });
  } catch (error) {
    console.error('Error adding case:', error.message);
    res.status(500).json({ success: false, message: 'Server Error: Unable to add case' });
  }
});

// GET: Get all cases
router.get('/', async (req, res) => {
  try {
    const cases = await Case.find();
    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cases' });
  }
});

module.exports = router;
