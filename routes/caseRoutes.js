const express = require('express');
const router = express.Router();
const Case = require('../models/Case');

// ✅ 1. Check for duplicate case
router.get("/check-duplicate", async (req, res) => {
  const { patientName, phoneNumber, visitDate } = req.query;
  try {
    const existing = await Case.findOne({ patientName, phoneNumber, visitDate });
    res.json({ exists: !!existing });
  } catch (err) {
    console.error("❌ Error checking duplicate case:", err);
    res.status(500).json({ error: "Server error while checking duplicate." });
  }
});

// ✅ 2. Get today's follow-up reminders
router.get('/followups/today', async (req, res) => {
  try {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    const casesWithTodayFollowups = await Case.find({
      followUps: {
        $elemMatch: {
          date: { $gte: start, $lte: end }
        }
      }
    });

    res.status(200).json(casesWithTodayFollowups);
  } catch (error) {
    console.error('❌ Error fetching today\'s follow-ups:', error);
    res.status(500).json({ message: 'Error fetching today\'s follow-ups', error: error.message });
  }
});

// ✅ 3. Create a new case
router.post('/', async (req, res) => {
  try {
    const {
      patientName,
      phoneNumber,
      symptoms,
      mentalSymptoms,
      remedyGiven,
      followUpDate,
      faceAnalysis
    } = req.body;

    if (!patientName || !phoneNumber || !symptoms) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newCase = new Case({
      patientName,
      phoneNumber,
      symptoms,
      mentalSymptoms,
      remedyGiven,
      followUpDate,
      faceAnalysis
    });

    await newCase.save();

    console.log('✅ New Case Submitted:');
    console.log(JSON.stringify(req.body, null, 2)); // Log the full case

    res.status(201).json({ message: 'Case saved successfully', data: newCase });
  } catch (err) {
    console.error('❌ Error saving case:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// ✅ 4. Get all cases
router.get('/', async (req, res) => {
  try {
    const cases = await Case.find().sort({ visitDate: -1 });
    res.status(200).json(cases);
  } catch (err) {
    console.error('❌ Error fetching cases:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// ✅ 5. Delete a case by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedCase = await Case.findByIdAndDelete(req.params.id);
    if (!deletedCase) {
      return res.status(404).json({ message: 'Case not found' });
    }
    res.status(200).json({ message: 'Case deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting case:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// ✅ 6. Update a case by ID
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

// ✅ 7. Add a follow-up to a case
router.post('/:id/followups', async (req, res) => {
  try {
    const { date, notes } = req.body;

    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      { $push: { followUps: { date, notes } } },
      { new: true }
    );

    res.status(200).json(updatedCase);
  } catch (error) {
    console.error('❌ Error adding follow-up:', error);
    res.status(500).json({ message: 'Error adding follow-up', error: error.message });
  }
});

// ✅ 8. Get a single case by ID
router.get('/:id', async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id);
    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }
    res.status(200).json(caseData);
  } catch (err) {
    console.error('❌ Error fetching case by ID:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

module.exports = router;
