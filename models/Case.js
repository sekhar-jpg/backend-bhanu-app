const mongoose = require('mongoose');

// Follow-Up Schema embedded within Case Schema
const followUpSchema = new mongoose.Schema({
  date: Date,
  notes: String
}, { _id: false });

const caseSchema = new mongoose.Schema({
  patientName: String,
  phoneNumber: String,
  visitDate: {
    type: Date,
    default: Date.now
  },
  symptoms: String,
  mentalSymptoms: String,
  followUps: [followUpSchema]  // Array to support multiple follow-ups
});

module.exports = mongoose.model('Case', caseSchema);
