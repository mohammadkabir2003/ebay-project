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


router.post('/register', (req, res) => {
  const { name, username, email, password } = req.body;

  // SQL query to insert a new user
  const query = `INSERT INTO users (name, username, email, password, status) VALUES (?, ?, ?, ?, 'pending')`;
  const values = [name, username, email, password];

  // Execute the query
  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Registration successful, awaiting admin approval' });
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const query = `SELECT * FROM users WHERE username = ?`;
  db.query(query, [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = results[0];

    // Check if the user is approved or rejected
    if (user.status === 'rejected') {
      return res.status(403).json({ error: 'Your account has been rejected by the admin.' });
    }

    // Check if the user is approved
    if (user.status !== 'approved') {
      return res.status(403).json({ error: 'User not approved' });
    }

    // Compare the password
    if (user.password !== password) {
      return res.status(400).json({ error: 'Incorrect password.' });
    }

    // Check and update role from visitor to user
    if (user.role === 'visitor') {
      const updateQuery = `UPDATE users SET role = 'user' WHERE id = ?`;
      db.query(updateQuery, [user.id], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to update user role.' });
        }
      });
    }

    // Set the session for the authenticated user
    req.session.user = { id: user.id, username: user.username, role: user.role };

    // Set role
    res.json({ message: 'Login successful', role: user.role });
  });
});

router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to log out.' });
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      return res.status(200).json({ message: 'Logged out successfully.' });
    });
  } else {
    res.status(200).json({ message: 'No active session.' });
  }
});

router.get('/session', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: 'No active session' });
  }
});


module.exports = router;