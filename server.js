const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Body parser middleware (if needed)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const rootsRouter = require('./routes/roots');
// If you have other routes, import them too
const caseRoutes = require('./routes/caseRoutes');
const followUpRoutes = require('./routes/followUpRoutes');
const userRoutes = require('./routes/userRoutes');

// Use routes
app.use('/roots', rootsRouter);
app.use('/cases', caseRoutes);
app.use('/followups', followUpRoutes);
app.use('/users', userRoutes);

// Default root route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// 404 handler (optional)
app.use((req, res, next) => {
  res.status(404).send('Route not found');
});

// Error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
