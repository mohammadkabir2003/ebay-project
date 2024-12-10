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

    // Check if the user is rejected
    if (user.status === 'rejected') {
      return res.status(403).json({ error: 'Your account has been rejected by the admin.' });
    }

    // Check if the user is pending
    if (user.status === 'pending') {
      return res.status(403).json({ error: 'User not approved, awaiting admin approval.' });
    }

    // Check if the user is banned
    if (user.status === 'banned') {
      return res.status(403).json({ error: 'User has been permanently banned.' });
    }

    // Check if the user is suspended three times
    if (user.suspensions === 3) {
      const banQuery = `UPDATE users SET status = 'banned' WHERE id = ?`;
      db.query(banQuery, [user.id], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to ban user.' });
      }
    });
    return res.status(403).json({ error: 'User has been permanently banned after three suspensions.' });
  } 

    // Check if the user is suspended and redirect to suspended page
    if (user.status === 'suspended') {
        req.session.user = { id: user.id, username: user.username, role: user.role };
      return res.status(403).json({ redirect: '/suspended' }); // Send redirect instruction
    }

    // Check if the user is pending
    if (user.status !== 'approved') {
      return res.status(403).json({ error: 'User must be approved to login' });
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

const isUser = (req, res, next) => {
  if (!req.session || !req.session.user || req.session.user.role !== 'user') {
    return res.status(403).json({ error: 'Access denied. Users only.' });
  }
  next();
};

// Route to update user's status to "leave"
router.post('/opt-out', isUser, (req, res) => {
  const userId = req.session.user.id; // Get user ID from the session

  const query = `UPDATE users SET status = 'leave' WHERE id = ?`;
  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found or already opted out.' });
    }

    res.json({ message: 'You have successfully opted out of the system.' });
  });
});

// Get details of the logged-in user
router.get('/userprofile', (req, res) => {
  const userId = req.session.user.id; // Get user ID from the session

  const query = `SELECT name, username, balance, transactions, is_vip FROM users WHERE id = ?`;
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(results[0]); // Send the user details
  });
});

// Route to deposit funds
router.post('/deposit', (req, res) => {
  const userId = req.session.user.id;
  const { amount } = req.body;
  if (amount <= 0) {
    return res.status(400).json({ error: 'Invalid deposit amount.' });
  }
  const query = `UPDATE users SET balance = balance + ? WHERE id = ?`;
  db.query(query, [amount, userId], (err, result) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Deposit successful!' });
  });
});

// Route to withdraw funds
router.post('/withdraw', (req, res) => {
  const userId = req.session.user.id;
  const { amount } = req.body;
  if (amount <= 0) {
    return res.status(400).json({ error: 'Invalid withdrawal amount.' });
  }
  const query = `UPDATE users SET balance = balance - ? WHERE id = ? AND balance >= ?`;
  db.query(query, [amount, userId, amount], (err, result) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'Insufficient balance.' });
    }
    res.json({ message: 'Withdrawal successful!' });
  });
});


// Middleware for checking if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Unauthorized access. Please log in.' });
  }
  next();
};

// Handle fine payment
router.post('/pay-fine', isAuthenticated, (req, res) => {
  const userId = req.session.user.id;

  // Check if the user is suspended
  const checkUserSuspensionQuery = `
    SELECT status, balance FROM users WHERE id = ?;
  `;
  
  db.query(checkUserSuspensionQuery, [userId], (err, results) => {
    if (err) {
      console.error('Error checking user suspension:', err);
      return res.status(500).json({ error: 'Failed to check user status.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = results[0];
    if (user.status !== 'suspended') {
      return res.status(400).json({ error: 'User is not suspended.' });
    }

    if (user.balance < 50) {
      return res.status(400).json({ error: 'Insufficient balance to pay fine.' });
    }

    // Deduct $50 fine from user balance and reactivate account
    const deductFineQuery = `
      UPDATE users SET balance = balance - 50, status = 'approved' WHERE id = ?;
    `;

    db.query(deductFineQuery, [userId], (err) => {
      if (err) {
        console.error('Error processing fine payment:', err);
        return res.status(500).json({ error: 'Failed to process fine payment.' });
      }

      res.json({ message: 'Fine paid successfully, account reactivated.' });
    });
  });
});

module.exports = router;