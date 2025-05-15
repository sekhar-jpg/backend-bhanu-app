// routes/roots.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Roots route is working!');
});

module.exports = router;
