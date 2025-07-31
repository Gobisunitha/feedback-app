const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection using Render-hosted DB (recommended to store in env)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://feedback_db_laym_user:jVKxBAneNSkyRuDaAxkUCzhgotBI0Gx7@dpg-d1sildvgi27c739f6ql0-a.singapore-postgres.render.com/feedback_db_laym',
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Test route to verify server is alive
app.get('/', (req, res) => {
  res.send('Feedback app backend is running');
});

// POST route to insert feedback
app.post('/submit', async (req, res) => {
  const { name, feedback } = req.body;

  if (!name || !feedback) {
    return res.status(400).send('Please fill out all fields');
  }

  try {
    await pool.query(
      'INSERT INTO feedback (name, feedback) VALUES ($1, $2)',
      [name, feedback]
    );
    res.send('Feedback submitted!');
  } catch (err) {
    console.error('Error inserting feedback:', err);
    res.status(500).send('Error saving feedback');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

