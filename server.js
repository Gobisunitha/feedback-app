require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle form submission
app.post('/submit', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await pool.query(
      'INSERT INTO feedback (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message]
    );
    res.status(200).send('Feedback submitted successfully');
  } catch (error) {
    console.error('Error inserting into database:', error);
    res.status(500).send('Server error. Please try again later.');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
