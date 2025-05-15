const express = require('express');
const app = express();

// ✅ Only use the Render-assigned port
const PORT = process.env.PORT;

app.get('/test-route', (req, res) => {
  console.log('✅ /test-route hit');
  res.send('✅ Simple test working!');
});

app.listen(PORT, () => {
  console.log(`🚀 Listening on ${PORT}`);
});
