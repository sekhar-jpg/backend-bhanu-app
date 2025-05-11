const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  // Add any other fields you may need, e.g. age, gender, etc.
});

module.exports = mongoose.model('User', userSchema);
