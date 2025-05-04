const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const caseRoutes = require('./routes/caseRoutes'); // ✅ Your routes

const app = express();
dotenv.config();

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Failed:', err));

// Routes
app.use('/api/cases', caseRoutes); // ✅ Main route

// Serve frontend from build
app.use(express.static(path.join(__dirname, '../build'))); // frontend build folder

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
