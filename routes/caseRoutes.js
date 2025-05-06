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
// Delete a case by ID (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const caseId = req.params.id;
    const deletedCase = await Case.findByIdAndDelete(caseId);
    if (!deletedCase) {
      return res.status(404).json({ message: 'Case not found' });
    }
    res.status(200).json({ message: 'Case deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting case:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});
// Update a case by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedCase = await Case.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCase) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.json({ message: 'Case updated successfully', data: updatedCase });
  } catch (err) {
    console.error('❌ Error updating case:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});
// Add follow-up to a case
router.post('/:id/followups', async (req, res) => {
  try {
    const caseId = req.params.id;
    const { date, notes } = req.body;

    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { $push: { followUps: { date, notes } } },
      { new: true }
    );

    res.status(200).json(updatedCase);
  } catch (error) {
    res.status(500).json({ message: 'Error adding follow-up', error: error.message });
  }
});

