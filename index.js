const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Replace with your actual connection string
const pool = new Pool({
  connectionString: 'postgresql://feedback_db_laym_user:jVKxBAneNSkyRuDaAxkUCzhgotBI0Gx7@dpg-d1sildvgi27c739f6ql0-a.singapore-postgres.render.com/feedback_db_laym',
  ssl: {
    rejectUnauthorized: false // Set to true if required by your provider
  }
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // This serves your HTML file from the same folder

app.post('/submit', async (req, res) => {
  const { feedback } = req.body;

  if (!feedback) {
    return res.status(400).send('Feedback is required');
  }

  try {
    await pool.query('INSERT INTO feedback (message) VALUES ($1)', [feedback]);
    res.status(200).send('Feedback received');
  } catch (error) {
    console.error('Error inserting feedback:', error);
    res.status(500).send('Database error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
