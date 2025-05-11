// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node'); // For TensorFlow.js
const blazeface = require('@tensorflow-models/blazeface'); // BlazeFace model for face detection

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

// CORS options to allow your frontend domain
const corsOptions = {
  origin: 'https://bhanu-homeo-frontend.onrender.com', // Frontend domain
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
  credentials: true, // Allow cookies/headers if needed
  allowedHeaders: 'Content-Type, Authorization', // Allowed headers
};

// Middleware setup
app.use(cors(corsOptions)); // Use the configured CORS options
app.use(bodyParser.json()); // Parse incoming JSON requests

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save the file to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save with a unique name
  }
});

const upload = multer({ storage: storage });

// ✅ Route imports
const caseRoutes = require('./routes/caseRoutes');
const followUpRoutes = require('./routes/followUpRoutes');

// ✅ Use routes
app.use('/api/cases', caseRoutes);
app.use('/api/followups', followUpRoutes);

// ✅ MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err.message));

// Endpoint to analyze uploaded image
app.post('/analyze-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image uploaded.');
  }

  try {
    // Load the BlazeFace model for face detection
    const model = await blazeface.load();

    // Read the uploaded image from the file system
    const imagePath = path.join(__dirname, 'uploads', req.file.filename);
    const imageBuffer = fs.readFileSync(imagePath);
    const imageTensor = tf.node.decodeImage(imageBuffer);

    // Run the image through the AI model (BlazeFace)
    const predictions = await model.estimateFaces(imageTensor, false);

    // Clean up the uploaded image after processing
    fs.unlinkSync(imagePath);

    // Return the analysis results (face positions, etc.)
    res.json({ message: 'Analysis completed', predictions: predictions });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during image analysis.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
