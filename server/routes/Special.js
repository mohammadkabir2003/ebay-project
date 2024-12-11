const express = require('express');
const router = express.Router();
const db = require('../db.js'); // Import the MySQL connection pool

// Route to get VIP users by ID
router.get('/vip/:id', (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters

  // Query to fetch users who are VIP and match the given ID
  const query = `SELECT id, name, username, email, balance, role, status, counter 
                 FROM users 
                 WHERE is_vip = TRUE AND id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch VIP users' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No VIP users found with the given ID' });
    }

    res.status(200).json({ vipUsers: results });
  });
});

router.get('/getInfo/:id', (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters

  // Query to fetch users who are VIP and match the given ID
  const query = `SELECT id, name, username, email, balance, role, status, counter, is_vip 
                 FROM users 
                 WHERE id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch VIP users' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No VIP users found with the given ID' });
    }

    res.status(200).json(results);
  });
});


// Route to increment the counter for a user
router.put('/increment-counter/:id', (req, res) => {
  const { id } = req.params; // Extract user ID from the request parameters

  // SQL query to increment the counter by 1
  const query = `UPDATE users SET counter = counter + 1 WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to increment the counter' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Counter incremented successfully' });
  });
});

router.put('/startVIPGame', (req, res) => {
  const query = `UPDATE vipGame SET isLive = 1 WHERE id = 1`;

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to UPDATE VIP Game' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'VIP Game not found' });
    }

    res.status(200).json({ message: 'VIP game started' });
  });
});

router.put('/endVIPGame', (req, res) => {
  const query = `UPDATE vipGame SET isLive = 0 WHERE id = 1`;

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to UPDATE VIP Game' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'VIP Game not found' });
    }

    res.status(200).json({ message: 'VIP game ENDED' });
  });
});

router.get('/getVipWinner', (req, res) => {
    const query = `SELECT * 
                    FROM users 
                    WHERE is_vip = 1 
                    ORDER BY counter DESC 
                    LIMIT 1;

`;

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to get user with highest counter' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'No Users' });
    }

    res.status(200).json(result[0]);
  });
});

router.put('/resetCounter', (req, res) => {
  const query = `UPDATE users
                SET counter = 0
                WHERE is_vip = 1;
                `;

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to UPDATE/RESET counter' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No Users affected with counter reset' });
    }

    res.status(200).json({ message: 'VIP game ENDED' });
  });
});

router.get('/gameState', (req, res) => {
  const query = 'SELECT isLive FROM vipGame WHERE id = 1';

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to get game state.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Game state not found.' });
    }

    res.status(200).json(result[0]);  // Return game state
  });
});

router.put('/updateBalance/:userId', (req, res) => {
    const { userId } = req.params;
    const { amount } = req.body;

    const query = `UPDATE users SET balance = balance + ? WHERE id = ?`;
    db.query(query, [amount, userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update balance.' });
        }
        res.status(200).json({ message: 'Balance updated successfully.' });
    });
});

module.exports = router;
