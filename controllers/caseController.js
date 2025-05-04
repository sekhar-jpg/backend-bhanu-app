const Case = require('../models/Case');
 // Ensure correct path to your case model

// Controller to create a new case
exports.createCase = async (req, res) => {
  try {
    // Validate that required fields are present in the request body
    if (
      !req.body.name ||
      !req.body.age ||
      !req.body.gender ||
      !req.body.maritalStatus ||
      !req.body.occupation ||
      !req.body.address ||
      !req.body.phone ||
      !req.body.dateOfVisit ||
      !req.body.chiefComplaints
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create new case from the request body
    const newCase = new Case(req.body);

    // Save the case in the database
    await newCase.save();

    // Return the newly created case
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
      followUpDate: {
        $gte: today,
        $lt: tomorrow
      }
    });

    res.status(200).json(followUps);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
