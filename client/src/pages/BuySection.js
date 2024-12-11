import React, { useState, useEffect } from 'react';

const BuyerTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch transactions on component mount
  useEffect(() => {
    fetch('http://localhost:3001/transaction', {
      credentials: 'include', // Include session cookies
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch transactions.');
        }
        return res.json();
      })
      .then((data) => {
        setTransactions(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch((err) => {
        console.error('Error fetching transactions:', err);
        setError('Could not load transactions.');
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle confirming a transaction
const handleConfirm = (transactionId) => {
  fetch(`http://localhost:3001/transaction/${transactionId}/confirm`, {
    method: 'POST',
    credentials: 'include', // Include session cookies
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((data) => {
          throw new Error(data.error || 'Failed to confirm transaction.');
        });
      }
      return res.json();
    })
    .then((data) => {
      setMessage(data.message);
      // Remove the confirmed transaction from the list
      setTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== transactionId)
      );
    })
    .catch((err) => {
      console.error('Error confirming transaction:', err);
      setError(err.message || 'Could not confirm transaction.');
    });
};

// Handle denying a transaction
const handleDeny = (transactionId) => {
  fetch(`http://localhost:3001/transaction/${transactionId}/deny`, {
    method: 'POST',
    credentials: 'include', // Include session cookies
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((data) => {
          throw new Error(data.error || 'Failed to deny transaction.');
        });
      }
      return res.json();
    })
    .then((data) => {
      setMessage(data.message);
      setTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== transactionId)
      );
    })
    .catch((err) => {
      console.error('Error denying transaction:', err);
      setError(err.message || 'Could not deny transaction.');
    });
};


  if (loading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Pending Transactions</h2>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}

      {transactions.length === 0 ? (
        <p>No pending transactions.</p>
      ) : (
        transactions.map((transaction) => (
          <div key={transaction.id} className="p-4 bg-white shadow-md mb-4 rounded">
            <h3 className="text-lg font-bold">Transaction #{transaction.id}</h3>
            <p>Listing ID: {transaction.listing_id}</p>
            <p>Amount: ${transaction.amount}</p>
            <div className="space-x-2 mt-2">
              <button
                onClick={() => handleConfirm(transaction.id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Confirm
              </button>
              <button
                onClick={() => handleDeny(transaction.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Deny
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BuyerTransactions;