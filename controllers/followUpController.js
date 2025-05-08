const FollowUp = require('../models/FollowUp');  // Import the FollowUp model

// Add a new follow-up
exports.addFollowUp = async (req, res) => {
  const { caseId, date, complaints, prescription, remarks } = req.body;

  const newFollowUp = new FollowUp({
    caseId,
    date,
    complaints,
    prescription,
    remarks,
  });

  try {
    const savedFollowUp = await newFollowUp.save();
    res.json({ success: true, followUp: savedFollowUp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to add follow-up' });
  }
};

// Get today's follow-ups
exports.getTodaysFollowUps = async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  try {
    const followUps = await FollowUp.find({
      followUpDate: { $gte: startOfDay, $lte: endOfDay }
    }).populate('caseId'); // Optional: Populate case data if necessary

    res.json({ followUps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching follow-ups' });
  }
};
