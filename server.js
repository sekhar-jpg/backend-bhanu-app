// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const blazeface = require('@tensorflow-models/blazeface');
const OpenAI = require('openai'); // ✅ OpenAI v4 SDK

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

// CORS configuration
const corsOptions = {
  origin: 'https://bhanu-homeo-frontend.onrender.com',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type, Authorization',
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup (2MB limit)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// Routes
const caseRoutes = require('./routes/caseRoutes');
const followUpRoutes = require('./routes/followUpRoutes');

app.use('/api/cases', caseRoutes);
app.use('/api/followups', followUpRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err.message));

// ------------------------------
// 📸 Image analysis endpoint
// ------------------------------
app.post('/analyze-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image uploaded.');
  }

  try {
    const model = await blazeface.load();
    const imagePath = path.join(__dirname, 'uploads', req.file.filename);
    const imageBuffer = fs.readFileSync(imagePath);
    const imageTensor = tf.node.decodeImage(imageBuffer);
    const predictions = await model.estimateFaces(imageTensor, false);
    fs.unlinkSync(imagePath); // delete after processing
    res.json({ message: 'Analysis completed', predictions });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during image analysis.');
  }
});

// ------------------------------
// 🧠 AI Case Analysis Endpoint
// ------------------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
      model: "gpt-3.5-turbo", // ✅ use gpt-3.5-turbo to avoid 404 error
      messages: [{ role: "user", content: prompt }],
    });

    const analysis = completion.choices[0].message.content;
    res.json({ success: true, analysis });
  } catch (error) {
    console.error('AI Error:', error.message);
    res.status(500).json({ success: false, error: 'AI analysis failed' });
  }
});

// ------------------------------
// 🚀 Start the server
// ------------------------------
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
