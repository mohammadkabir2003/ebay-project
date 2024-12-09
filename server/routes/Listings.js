const express = require('express');
const router = express.Router();
const db = require('../db.js');

// Get all listings
router.get('/', (req, res) => {
    const query = `
        SELECT listings.*, users.name AS user_name
        FROM listings
        JOIN users ON listings.user_id = users.id
        WHERE listings.status != 'sold'
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      console.log('Fetched listings:', results);
      res.json(results);
    });
});

// Create new listing
router.post('/create', (req, res) => {
    // Check if user is authenticated
    if (!req.session?.user?.id) {
        return res.status(401).json({ error: 'You must be logged in to create a listing' });
    }

    const { title, description, minBid, maxBid } = req.body;
    const userId = req.session.user.id;

    // Validate required fields
    if (!title || !description || !minBid || !maxBid) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate bid values
    if (parseFloat(minBid) >= parseFloat(maxBid)) {
        return res.status(400).json({ error: 'Minimum bid must be less than maximum bid' });
    }

    const query = `
        INSERT INTO listings (user_id, title, description, min_bid, max_bid)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [userId, title, description, minBid, maxBid], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to create listing' });
        }

        res.status(201).json({
            message: 'Listing created successfully',
            listingId: result.insertId
        });
    });
});

module.exports = router;