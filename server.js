const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const caseRoutes = require('./routes/caseRoutes');
const dotenv = require('dotenv');

dotenv.config();  // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 10000;

// Middleware to handle JSON data
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log('MongoDB Connection Error:', err));

// Routes for the API
app.use('/api/cases', caseRoutes);

// Serve static files from the React frontend build folder
app.use(express.static(path.join(__dirname, 'build')));

// Serve index.html for all non-API routes (to handle frontend routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
