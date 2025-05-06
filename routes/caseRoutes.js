const express = require('express');
const router = express.Router();
const Case = require('../models/Case'); // Assuming model file is models/Case.js

// Create a new case (POST)
router.post('/', async (req, res) => {
  try {
    const {
      patientName,
      phoneNumber,
      symptoms,
      remedyGiven,
      followUpDate,
    } = req.body;

    // Validate required fields
    if (!patientName || !phoneNumber || !symptoms) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create and save the case
    const newCase = new Case({
      patientName,
      phoneNumber,
      symptoms,
      remedyGiven,
      followUpDate,
    });

    await newCase.save();
    res.status(201).json({ message: 'Case saved successfully', data: newCase });
  } catch (err) {
    console.error('❌ Error saving case:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// Get all cases (GET)
router.get('/', async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    res.status(200).json(cases);
  } catch (err) {
    console.error('❌ Error fetching cases:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

module.exports = router;
