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
app.use(bodyParser.urlencoded({ extended: true })); // For HTML form submissions
app.use(bodyParser.json()); // For JSON submissions (optional but useful)
app.use(express.static(path.join(__dirname, "public"))); // Serve frontend files

// Serve index.html on root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Feedback submission handler
app.post("/submit-feedback", async (req, res) => {
  const { name, email, rating, message } = req.body;

  try {
    await pool.query(
      "INSERT INTO feedback (name, email, rating, message) VALUES ($1, $2, $3, $4)",
      [name, email, rating, message]
    );
    res.redirect("/"); // Go back to the form
  } catch (err) {
    console.error("Error saving feedback:", err);
    res.status(500).send("Failed to submit feedback");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
