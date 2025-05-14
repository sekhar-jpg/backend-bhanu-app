const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 10000;

// OpenAI API setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Schema and Model
const CaseSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  symptoms: String,
  mindRubrics: String,
  imageBase64: String,
  followUps: [Object],
  createdAt: { type: Date, default: Date.now },
});

const PatientCase = mongoose.model('PatientCase', CaseSchema);

// Routes
app.get('/', (req, res) => {
  res.send('Bhanu Homeopathy AI Server is Live! 🎉');
});

app.post('/submit-case', async (req, res) => {
  try {
    const { name, age, gender, symptoms, mindRubrics, imageBase64 } = req.body;

    const newCase = new PatientCase({
      name,
      age,
      gender,
      symptoms,
      mindRubrics,
      imageBase64,
    });

    await newCase.save();
    res.status(200).json({ success: true, message: 'Case submitted successfully' });
  } catch (error) {
    console.error('Submit Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to submit case' });
  }
});

app.post('/api/analyze-case', async (req, res) => {
  try {
    const { name, age, gender, symptoms, mindRubrics, imageBase64 } = req.body;

    const prompt = `
