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

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

// CORS options
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

// Multer setup with file size limit (2MB)
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
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

// Route imports
const caseRoutes = require('./routes/caseRoutes');
const followUpRoutes = require('./routes/followUpRoutes');

// Use routes
app.use('/api/cases', caseRoutes);
app.use('/api/followups', followUpRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err.message));

// Image analysis endpoint
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

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
