const express = require('express');
const db = require('../db.js');
const sellerRouter = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Unauthorized access. Please log in.' });
  }
  next();
};

// Get seller's listings with highest bids
sellerRouter.get('/seller/listings', (req, res) => {
    const sellerId = req.session.user.id; // Seller's ID from session
  
    const query = `
      SELECT 
        listings.id AS listing_id, 
        listings.title, 
        listings.description, 
        listings.min_bid, 
        listings.max_bid,
        listings.status, 
        listings.highest_bidder_id,
        COALESCE(MAX(bids.amount), 0) AS highest_bid,
        (SELECT users.username 
       FROM users 
       WHERE users.id = listings.highest_bidder_id
      ) AS highest_bidder_username
      FROM listings
      LEFT JOIN bids ON listings.id = bids.listing_id
      WHERE listings.user_id = ?
      GROUP BY listings.id
    `;
  
    db.query(query, [sellerId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'No listings found' });
      }
      res.json(results);
    });
  });

  sellerRouter.post('/transaction/start', isAuthenticated, (req, res) => {
    const { listing_id, buyer_id, amount } = req.body;
    const seller_id = req.session.user.id;
  
    // Validate input
    if (!listing_id || !buyer_id || !amount) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
  
    // Check if a transaction for this listing already exists
    const checkQuery = `SELECT * FROM transactions WHERE listing_id = ? AND status = 'pending'`;
    db.query(checkQuery, [listing_id], (err, results) => {
      if (err) {
        console.error('Database error during validation:', err);
        return res.status(500).json({ error: 'Failed to validate existing transactions.' });
      }
  
      if (results.length > 0) {
        return res.status(400).json({ error: 'A pending transaction already exists for this listing.' });
      }
  
      // Insert the new transaction
      const query = `
        INSERT INTO transactions (buyer_id, seller_id, listing_id, amount, status)
        VALUES (?, ?, ?, ?, 'pending')
      `;
      db.query(query, [buyer_id, seller_id, listing_id, amount], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to start transaction.' });
        }

    // Update the listing's status to "pending"
    const updateListingQuery = `
    UPDATE listings
    SET status = 'pending'
    WHERE id = ?
  `;
  db.query(updateListingQuery, [listing_id], (err) => {
    if (err) {
      console.error('Database error during listing status update:', err);
      return res.status(500).json({ error: 'Failed to update listing status.' });
    }
  
        res.json({ message: 'Transaction started successfully.' });
      });
    });
  });
});

// Fetch transactions for the logged-in buyer
sellerRouter.get('/transaction', isAuthenticated, (req, res) => {
    const buyerId = req.session.user.id; // Get the buyer's ID from the session
  
    const query = `
    SELECT 
      transactions.id, 
      transactions.listing_id, 
      transactions.amount, 
      transactions.status, 
      listings.title AS listing_title, 
      users.name AS seller_name
    FROM transactions
    INNER JOIN listings ON transactions.listing_id = listings.id
    INNER JOIN users ON transactions.seller_id = users.id
    WHERE transactions.buyer_id = ? AND transactions.status = 'pending'
  `;
  
    db.query(query, [buyerId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      res.json(results);
    });
  });

  const updateVipStatus = async (userId) => {
    try {
      // Query to check user details
      const query = `
        SELECT 
          balance, 
          transactions,
          complaints
        FROM users 
        WHERE id = ?
      `;
  
      db.query(query, [userId], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return; // Stop execution on error
        }
    
        if (results.length === 0) {
          console.log('User not found.');
          return; // Stop execution if user is not found
        }
    
        const { balance, transactions, complaints } = results[0];
        const isVip = balance > 5000 && transactions > 5 && complaints === 0;
    
        // Update the user's VIP status
        const updateQuery = `UPDATE users SET is_vip = ? WHERE id = ?`;
        db.query(updateQuery, [isVip, userId], (updateErr) => {
          if (updateErr) {
            console.error('Error updating VIP status:', updateErr);
            return; // Stop execution on error
          }
    
          console.log(`User ID ${userId}: VIP status updated to ${isVip}`);
        });
      });
    } catch (error) {
      console.error('Error updating VIP status:', error);
    };
  };

  sellerRouter.post('/transaction/:id/confirm', isAuthenticated, (req, res) => {
    const transactionId = req.params.id;
    console.log('Transaction ID:', transactionId);  // Log to check its value

    // Fetch transaction details first
    const transactionQuery = `
      SELECT listing_id, buyer_id, seller_id, amount, status 
      FROM transactions 
      WHERE id = ? AND status = 'pending'
    `;
  
    db.query(transactionQuery, [transactionId], (err, results) => {
      if (err) {
        console.error('Error fetching transaction:', err);
        return res.status(500).json({ error: 'Failed to retrieve transaction details.' });
      }
  
      console.log('Transaction fetch results:', results);  // Log the query results for debugging
  
      if (results.length === 0) {
        console.error(`Transaction with ID ${transactionId} not found or already completed.`);
        return res.status(404).json({ error: `Transaction with ID ${transactionId} not found or already completed.` });
      }
      
  
      const { buyer_id, seller_id, amount } = results[0];

          // Check if the buyer is a VIP
    const vipQuery = `SELECT is_vip FROM users WHERE id = ?`;
    db.query(vipQuery, [buyer_id], (vipErr, vipResults) => {
      if (vipErr) {
        console.error('Database error:', vipErr);
        return res.status(500).json({ error: 'Failed to check VIP status.' });
      }

      if (vipResults.length === 0) {
        return res.status(404).json({ error: 'Buyer not found.' });
      }

      const isVip = vipResults[0].is_vip;
      const finalAmount = isVip ? amount * 0.9 : amount; // Apply 10% discount if VIP
  
      // Continue with balance update and transaction confirmation...
      const updateTransactionQuery = `
        UPDATE transactions 
        SET status = 'completed' 
        WHERE id = ? AND status = 'pending'
      `;
  
      db.query(updateTransactionQuery, [transactionId], (err) => {
        if (err) {
          console.error('Error updating transaction status:', err);
          return res.status(500).json({ error: 'Failed to confirm transaction.' });
        }
  
        // Balance transfer logic...
        const updateBalancesQuery = `
          UPDATE users 
          SET balance = CASE 
            WHEN id = ? THEN balance - ?  -- Deduct from buyer
            WHEN id = ? THEN balance + ?  -- Add to seller
            ELSE balance
          END
          WHERE id IN (?, ?)
        `;
  
        db.query(updateBalancesQuery, [buyer_id, finalAmount, seller_id, finalAmount, buyer_id, seller_id], (err) => {
          if (err) {
            console.error('Error updating balances:', err);
            return res.status(500).json({ error: 'Failed to update balances.' });
          }

    // Get the listing ID associated with the transaction
    const getTransactionQuery = `
    SELECT listing_id FROM transactions WHERE id = ?
  `;
  db.query(getTransactionQuery, [transactionId], (err, results) => {
    if (err) {
      console.error('Error fetching transaction details:', err);
      return res.status(500).json({ error: 'Failed to fetch transaction details.' });
    }

    const listingId = results[0]?.listing_id;

    if (!listingId) {
      return res.status(404).json({ error: 'Listing not found for the transaction.' });
    }

    // Update listing status to 'sold'
    const updateListingQuery = `
      UPDATE listings 
      SET status = 'sold' 
      WHERE id = ?
    `;
    db.query(updateListingQuery, [listingId], (err) => {
      if (err) {
        console.error('Error updating listing status:', err);
        return res.status(500).json({ error: 'Failed to update listing status.' });
      }

            // Increment the buyer's transaction count
            const incrementTransactionCountQuery = `
            UPDATE users 
            SET transactions = transactions + 1 
            WHERE id = ?
          `;
  
          db.query(incrementTransactionCountQuery, [buyer_id], (err) => {
            if (err) {
              
                console.error('Error incrementing transaction count:', incrementErr);
                return res.status(500).json({ error: 'Failed to update buyer transaction count.' });
              
            }

                  // Update VIP status for buyer
                  updateVipStatus(buyer_id);

  
                  res.json({ message: `Transaction confirmed successfully. Final amount: $${finalAmount.toFixed(2)}`, finalAmount });
        });
      });
    });
  });
  });
  });
  });
  });
  
  
sellerRouter.post('/transaction/:id/deny', isAuthenticated, (req, res) => {
    const transactionId = req.params.id;
  
    const query = `
      UPDATE transactions 
      SET status = 'cancelled' 
      WHERE id = ? AND status = 'pending'
    `;
  
    db.query(query, [transactionId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to deny transaction.' });
      }

    // Check if transaction was updated
    if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Transaction not found or already completed.' });
      }

       // Get the listing ID associated with the transaction
       const getTransactionQuery = `
       SELECT listing_id FROM transactions WHERE id = ?
     `;
     db.query(getTransactionQuery, [transactionId], (err, results) => {
       if (err) {
         console.error('Error fetching transaction details:', err);
         return res.status(500).json({ error: 'Failed to fetch transaction details.' });
       }
 
       const listingId = results[0]?.listing_id;
 
       if (!listingId) {
         return res.status(404).json({ error: 'Listing not found for the transaction.' });
       }
 
       // Update listing status to 'available'
       const updateListingQuery = `
         UPDATE listings 
         SET status = 'available' 
         WHERE id = ?
       `;
       db.query(updateListingQuery, [listingId], (err) => {
         if (err) {
           console.error('Error updating listing status:', err);
           return res.status(500).json({ error: 'Failed to update listing status.' });
         }

      res.json({ message: 'Transaction denied successfully.' });
    });
  });
  });
});
  
sellerRouter.get('/transactions/completed', isAuthenticated, (req, res) => {
    const buyerId = req.session.user.id; // Get the buyer's ID from the session
  
    const query = `
      SELECT 
        transactions.id AS transaction_id,
        transactions.listing_id,
        transactions.amount,
        transactions.status,
        listings.title AS listing_title,
        users.name AS seller_name
      FROM transactions
      INNER JOIN listings ON transactions.listing_id = listings.id
      INNER JOIN users ON transactions.seller_id = users.id
      WHERE transactions.buyer_id = ? AND transactions.status = 'completed'
    `;
  
    db.query(query, [buyerId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      res.json(results); // Send completed transactions to the frontend
    });
});
    

module.exports = sellerRouter;