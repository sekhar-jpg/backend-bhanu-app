const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const caseRoutes = require('./routes/caseRoutes');
const dotenv = require('dotenv');

dotenv.config();  // Load environment variables

const app = express();
const port = process.env.PORT || 10000;

// Middleware for JSON requests
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log('MongoDB Connection Error:', err));

// Routes for API endpoints
app.use('/api/cases', caseRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
