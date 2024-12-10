const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.get('/ratings/user', (req, res) => {
  
  if (req.session && req.session.user) {
    const userId = req.session.user.id;
    //console.log('User ID:', userId);
    
    // Perform the database query or any operation with the userId
    
   res.json({
      id: req.session.user.id,
      username: req.session.user.username,
      email: req.session.user.email
    });
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});

//gets transactions where logged in person is a a seller
router.get('/transactions/buyers/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT DISTINCT users.*, transactions.id AS transaction_id
    FROM users
    INNER JOIN transactions ON users.id = transactions.buyer_id
    WHERE transactions.seller_id = ?
    AND transactions.isBuyerRated = 0 AND transactions.status = 'completed'
  `;
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'There was an error getting transactions that matches your id for /transactions/buyers/:id' });
    }
    if (!results || results.length === 0) {
      return res.status(200).json([]);
    }

    res.json(results);
  });
}) 

//gets transactions where logged in person is a a buyer
router.get('/transactions/sellers/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT DISTINCT users.*, transactions.id AS transaction_id
    FROM users
    INNER JOIN transactions ON users.id = transactions.seller_id
    WHERE transactions.buyer_id = ?
    AND transactions.isSellerRated = 0 AND transactions.status = 'completed'
  `;
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'There was an error getting transactions that matches your id for /transactions/sellers/:id' });
    }
    if (!results || results.length === 0) {
      return res.status(200).json([]);
    }
    res.json(results);
  });
})

router.post('/ratings', async (req, res) => {
  let forSuspend = false;
  const ratings = req.body; // Array of ratings
  const rateeIds = new Set(); // To track unique ratee IDs for suspension check

  try {
    // Insert ratings into the ratings table
    for (const rating of ratings) {
      await new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO ratings (rater_id, ratee_id, rating) VALUES (?, ?, ?)',
          [rating.rater_id, rating.ratee_id, rating.rating],
          (err, result) => {
            if (err) {
              reject(err); // Reject on error
            } else {
              rateeIds.add(rating.ratee_id); // Track the ratee_id for suspension check
              resolve(result); // Resolve when the query completes
            }
          }
        );
      });
    }

    // Now update the transaction table based on the ratings
    for (const rating of ratings) {
      // Make the SELECT query asynchronous and print the result
      const checker = await new Promise((resolve, reject) => {
        db.query(
          'SELECT buyer_id FROM transactions WHERE transactions.id = ? AND buyer_id = ?',
          [rating.transaction_id, rating.rater_id],
          (err, rows) => {
            if (err) {
              reject(err); // Reject on error
            } else {
              resolve(rows); // Resolve with the query result
            }
          }
        );
      });

      console.log('Checker result:', checker);

      if (checker.length > 0) {
        // If a matching buyer is found, update isSellerRated
        await new Promise((resolve, reject) => {
          db.query(
            'UPDATE transactions SET isSellerRated = 1 WHERE transactions.id = ?',
            [rating.transaction_id],
            (err, result) => {
              if (err) {
                reject(err); // Reject on error
              } else {
                forSuspend = true;
                resolve(result); // Resolve when the query completes
              }
            }
          );
        });
      } else {
        // If no matching buyer, update isBuyerRated
        await new Promise((resolve, reject) => {
          db.query(
            'UPDATE transactions SET isBuyerRated = 1 WHERE transactions.id = ?',
            [rating.transaction_id],
            (err, result) => {
              if (err) {
                reject(err); // Reject on error
              } else {
                resolve(result); // Resolve when the query completes
              }
            }
          );
        });
      }
    }

    // Check for suspension at the end of the loop
    for (const rateeId of rateeIds) {
      const suspensionCheck = await new Promise((resolve, reject) => {
        db.query(
          `
          SELECT AVG(CAST(rating AS SIGNED)) AS average_rating, COUNT(*) AS rating_count
          FROM ratings
          WHERE ratee_id = ?`,
          [rateeId],
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results[0]);
            }
          }
        );
      });

      const { average_rating, rating_count } = suspensionCheck;
      //if too mean or too nice --> get suspended
      if ((rating_count >= 3 && average_rating < 2) || rating_count >= 3 && average_rating > 4) {
        console.log(`User with ID ${rateeId} should be suspended.`);
        // Add your suspension logic here, such as updating the user's status in the database
        await new Promise((resolve, reject) => {
          db.query(
            'UPDATE users SET status = "suspended", suspensions = suspensions + 1 WHERE id = ?',
            [rateeId],
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
      }
    }

    res.status(200).send({ message: 'Ratings and transactions updated successfully!' });
  } catch (err) {
    console.error('Error processing ratings or updating transactions:', err);
    res.status(500).send({ error: 'Failed to process ratings or update transactions.' });
  }
});





module.exports = router;
