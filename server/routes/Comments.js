const express = require('express');
const router = express.Router();
const db = require('../db.js');

// Get comments for a listing
router.get('/listings/:listingId/comments', (req, res) => {
  const query = `
    SELECT c.*, u.username 
    FROM comments c 
    LEFT JOIN users u ON c.user_id = u.id 
    WHERE c.listing_id = ? 
    ORDER BY c.created_at DESC
  `;
  
  db.query(query, [req.params.listingId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Add a comment to a listing
router.post('/listings/:listingId/comments', (req, res) => {
  const { comment_text } = req.body;
  const listing_id = req.params.listingId;
  const user_id = req.session.user ? req.session.user.id : null;

  const query = `INSERT INTO comments (listing_id, user_id, comment_text) VALUES (?, ?, ?)`;
  
  db.query(query, [listing_id, user_id, comment_text], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Comment added successfully' });
  });
});

module.exports = router; 