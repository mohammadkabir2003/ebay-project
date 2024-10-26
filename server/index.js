require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt'); 
const db = require('./db'); // Import the MySQL connection pool from db.js

const app = express();

// Start the server
//const PORT = process.env.PORT;
app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});

/*
// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// Example route to get users
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  const query = `INSERT INTO users (username, password, status) VALUES (?, ?, 'pending')`;
  db.query(query, [username, hashedPassword], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Registration successful, awaiting admin approval' });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const query = `SELECT * FROM users WHERE username = ?`;
  db.query(query, [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = results[0];

    // Check if the user is approved
    if (user.status !== 'approved') {
      return res.status(403).json({ error: 'User not approved' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect password' });
    }


  });
});
*/