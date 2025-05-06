const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  symptoms: {
    type: String,
    required: true,
  },
  remedyGiven: {
    type: String,
  },
  followUpDate: {
    type: Date, // 🔁 This field is used for follow-up tracking
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Case', caseSchema);
const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  date: Date,
  notes: String
});

const caseSchema = new mongoose.Schema({
  patientName: String,
  phoneNumber: String,
  symptoms: String,
  mentalSymptoms: String,
  remedyGiven: String,
  visitDate: Date,
  followUps: [followUpSchema], // Array of follow-up objects
}, {
  timestamps: true
});

module.exports = mongoose.model('Case', caseSchema);

