const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
  connectionString: 'postgresql://feedback_db_laym_user:jVKxBAneNSkyRuDaAxkUCzhgotBI0Gx7@dpg-d1sildvgi27c739f6ql0-a.singapore-postgres.render.com/feedback_db_laym',
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the form page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
  const { name, feedback } = req.body;

  if (!name || !feedback) {
    return res.status(400).send('Please fill out all fields.');
  }

  try {
    await pool.query(
      'INSERT INTO feedback (name, message) VALUES ($1, $2)',
      [name, feedback]
    );
    // Redirect to success page to avoid resubmission
    res.redirect('/success');
  } catch (err) {
    console.error('Error inserting feedback:', err);
    res.status(500).send('Something went wrong while saving your feedback.');
  }
});

// Success route (shows


