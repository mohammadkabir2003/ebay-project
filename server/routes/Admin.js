const express = require('express');
const adminrouter = express.Router();
const db = require('../db.js'); // Import the MySQL connection pool


const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Unauthorized access. Please log in.' });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (!req.session || !req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
};

adminrouter.get('/admin/pending-users', isAdmin, isAuthenticated, (req, res) => {
    const query = `SELECT id, name, username, email, status FROM users WHERE status = 'pending'`;
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
  });
});
  
adminrouter.post('/admin/update-status', isAdmin, (req, res) => {
    const { userId, status } = req.body;
  
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
  
    const query = `UPDATE users SET status = ? WHERE id = ?`;
    db.query(query, [status, userId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ message: `User ${status} successfully` });
  });
});

adminrouter.get('/admin/leaving-users', isAdmin, isAuthenticated, (req, res) => {
  const query = `SELECT id, name, username, email, status FROM users WHERE status = 'leave'`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
});
});

adminrouter.post('/admin/opt-out', isAdmin, (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  const query = `DELETE FROM users WHERE id = ? AND status = 'leave'`;
  db.query(query, [userId], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ message: `User left system successfully` });
});
});  


module.exports = adminrouter;