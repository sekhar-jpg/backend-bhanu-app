const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const followUpRoutes = require('./routes/followUpRoutes');  // Import routes

const app = express();

// Middleware
app.use(bodyParser.json());  // To parse incoming JSON data

// MongoDB Connection
mongoose.connect('mongodb+srv://<username>:<password>@cluster0.wm2pxqs.mongodb.net/homeopathy?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Routes
app.use('/api', followUpRoutes);  // Use the follow-up routes for `/api`

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
