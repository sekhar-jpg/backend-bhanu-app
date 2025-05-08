const mongoose = require('mongoose');
const FollowUp = require('../models/FollowUp'); // Import the FollowUp model

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
    console.error('Add FollowUp Error:', err);
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
      date: { $gte: startOfDay, $lte: endOfDay }
    }).populate('caseId'); // Populate case data if needed

    res.json({ success: true, followUps });
  } catch (err) {
    console.error("Get Today's FollowUps Error:", err);
    res.status(500).json({ success: false, message: 'Error fetching follow-ups' });
  }
};
exports.deleteFollowUp = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid follow-up ID format' });
  }

  try {
    const followUp = await FollowUp.findByIdAndDelete(id);

    if (!followUp) {
      return res.status(404).json({ success: false, message: 'Follow-up not found' });
    }

    res.json({ success: true, message: 'Follow-up deleted successfully' });
  } catch (err) {
    console.error('Delete FollowUp Error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete follow-up' });
  }
};

