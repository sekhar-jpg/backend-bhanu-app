const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  date: { type: Date, required: true },
  complaints: String,
  prescription: String,
  remarks: String,
}, { timestamps: true });

module.exports = mongoose.model('FollowUp', followUpSchema);
