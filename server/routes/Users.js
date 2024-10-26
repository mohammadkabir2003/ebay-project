const express = require('express');
const router = express.Router();
const db = require('../db.js'); // Import the MySQL connection pool



// Route to get users
router.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

/*
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
module.exports = router;