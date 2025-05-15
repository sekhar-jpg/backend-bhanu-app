const express = require('express');
const app = express();

const PORT = process.env.PORT || 10000;

app.get('/test-route', (req, res) => {
  console.log('✅ /test-route hit');
  res.send('✅ Simple test working!');
});

app.listen(PORT, () => {
  console.log(`🚀 Listening on ${PORT}`);
});
