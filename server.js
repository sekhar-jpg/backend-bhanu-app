const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 10000;

// OpenAI setup
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
You are a top homeopathy expert. A patient case is submitted:

Name: ${name}
Age: ${age}
Gender: ${gender}
Symptoms: ${symptoms}
Mind Rubrics: ${mindRubrics}

Based on this case, provide:
1. Best remedy with reason
2. Miasmatic interpretation
3. Constitutional logic
4. Repertory logic
5. Materia Medica match
6. 2-3 similar remedies with reasons
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const analysis = completion.choices[0].message.content;
    res.json({ success: true, analysis });

  } catch (error) {
    console.error('AI Error:', error.message);
    res.status(500).json({ success: false, error: 'AI analysis failed: ' + error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
