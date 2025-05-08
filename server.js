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

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
