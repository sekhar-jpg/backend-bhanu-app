const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

// Load Routes
const caseRoutes = require('./routes/caseRoutes');

// Use Routes
app.use('/api/cases', caseRoutes); // This handles POST and GET routes for cases
// Add follow-up route separately if it's needed as part of another logic or structure

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err.message));

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
