const express = require('express');
const bidrouter = express.Router();
const db = require('../db.js');

// Get all bids
bidrouter.get('/bids', (req, res) => {
    const query = 'SELECT * FROM bids';
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    });
  });
  
  // Place a bid on a listing
  bidrouter.post('/listings/:id/bid', (req, res) => {
    const { id } = req.params; // Listing ID
    const { amount } = req.body; // Bid amount
  
    // Check if user is authenticated
    if (!req.session || !req.session.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = req.session.user.id; // Logged-in user's ID

      // Check if the user is the owner of the listing
  const ownerQuery = `SELECT user_id FROM listings WHERE id = ?`;
  db.query(ownerQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const ownerId = results[0].user_id;
    if (ownerId === userId) {
      return res.status(403).json({ error: 'Sellers cannot bid on their own listings.' });
    }

      // Check if the user has sufficient balance
      const balanceQuery = `SELECT balance FROM users WHERE id = ?`;
      db.query(balanceQuery, [userId], (err, userResults) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
  
        if (userResults.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        const userBalance = userResults[0].balance;
        if (userBalance < amount) {
          return res.status(400).json({ error: 'Insufficient balance to place this bid.' });
      }

    // Check if the bid is valid
    const query = `SELECT min_bid, max_bid FROM listings WHERE id = ?`;
    db.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Listing not found' });
      }
  
      const { min_bid, max_bid } = results[0];
  
      if (!min_bid || !max_bid) {
        return res.status(500).json({ error: 'Invalid listing data' });
      }
  
      if (amount < min_bid) {
        return res.status(400).json({ error: `Bid must be at least $${min_bid}` });
      }
  
      // Check the current highest bid
      const highestBidQuery = `SELECT MAX(amount) AS highest_bid FROM bids WHERE listing_id = ?`;
      db.query(highestBidQuery, [id], (err, bidResults) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
  
        const highestBid = bidResults[0]?.highest_bid || 0;
  
        if (amount <= highestBid) {
          return res.status(400).json({ error: `Bid must be higher than the current highest bid: $${highestBid}` });
        }
  
        if (amount > max_bid) {
          return res.status(400).json({ error: `Bid cannot exceed the maximum bid: $${max_bid}` });
        }

          // Check if the listing is pending
  const checkListingStatusQuery = `
  SELECT status FROM listings WHERE id = ?
`;
db.query(checkListingStatusQuery, [id], (err, results) => {
  if (err) {
    return res.status(500).json({ error: 'Database error' });
  }

  if (results.length === 0) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  const listingStatus = results[0].status;

  // Prevent bidding if the listing is pending
  if (listingStatus === 'pending') {
    return res.status(400).json({ error: 'Bidding is not allowed on pending listings.' });
  }
  
        // Insert the bid
        const insertQuery = `INSERT INTO bids (listing_id, user_id, amount) VALUES (?, ?, ?)`;
        db.query(insertQuery, [id, userId, amount], (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to place bid' });
          }

          const updateListingQuery = `
          UPDATE listings
          SET highest_bidder_id = ?
          WHERE id = ?
        `;
        db.query(updateListingQuery, [userId, id], (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to update highest bidder' });
          }


  
          res.json({ message: 'Bid placed successfully!', highest_bid: amount });
        });
      });
    });
  });
  });
});
});
});
  
  // Route to fetch the current highest bid for a listing
  bidrouter.get('/listings/:id/highest-bid', (req, res) => {
    const { id } = req.params;
  
    const query = `SELECT MAX(amount) AS highest_bid FROM bids WHERE listing_id = ?`;
    db.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
  
      res.json({ highest_bid: results[0]?.highest_bid || 0 });
    });
  });

module.exports = bidrouter;