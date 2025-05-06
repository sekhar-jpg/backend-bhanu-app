const Case = require('../models/Case');
const FollowUp = require('../models/FollowUp');

// Controller to create a new case
exports.createCase = async (req, res) => {
  try {
    if (
      !req.body.patientName ||
      !req.body.phoneNumber ||
      !req.body.visitDate ||
      !req.body.symptoms ||
      !req.body.mentalSymptoms
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newCase = new Case(req.body);
    await newCase.save();
    res.status(201).json(newCase);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// Controller to get all cases
exports.getCases = async (req, res) => {
  try {
    const cases = await Case.find();
    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get today's follow-up cases
exports.getTodayFollowUps = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const followUps = await Case.find({
      "followUps.date": {
        $gte: today,
        $lt: tomorrow
      }
    });

    res.status(200).json(followUps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to add follow-up to a case
exports.addFollowUp = async (req, res) => {
  try {
    const caseId = req.params.id;
    const { date, notes } = req.body;

    const caseToUpdate = await Case.findById(caseId);
    if (!caseToUpdate) {
      return res.status(404).json({ message: "Case not found" });
    }

    const followUp = {
      date: new Date(date),
      notes
    };

    caseToUpdate.followUps.push(followUp);
    await caseToUpdate.save();
    res.status(200).json({ message: "Follow-up added successfully", case: caseToUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding follow-up" });
  }
};

// Controller to delete a case
exports.deleteCase = async (req, res) => {
  try {
    const caseId = req.params.id;
    const deletedCase = await Case.findByIdAndDelete(caseId);

    if (!deletedCase) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.status(200).json({ message: 'Case deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
