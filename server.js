const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

// PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',         // Your PostgreSQL username
  host: 'localhost',
  database: 'feedback_db_laym', // Your database name
  password: 'system', // Your PostgreSQL password
  port: 5432                // Default PostgreSQL port
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// POST route to insert feedback
app.post('/submit', async (req, res) => {
  const { name, feedback } = req.body;
  try {
    await pool.query('INSERT INTO feedback (name, feedback) VALUES ($1, $2)', [name, feedback]);
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
