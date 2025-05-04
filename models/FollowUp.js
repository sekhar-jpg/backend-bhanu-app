const mongoose = require('mongoose');

// Follow-Up Schema
const FollowUpSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },  // Linking follow-up to a specific case
  date: { type: Date, required: true },  // Date of follow-up
  complaints: { type: String, required: true },  // Complaints for follow-up
  prescription: { type: String, required: true },  // Prescription given during follow-up
  remarks: { type: String, required: true },  // Additional remarks
});

module.exports = mongoose.model('FollowUp', FollowUpSchema);
