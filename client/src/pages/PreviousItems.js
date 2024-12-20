import React, { useState, useEffect } from 'react';

const CompletedTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch completed transactions for the logged-in buyer
  useEffect(() => {
    fetch('http://localhost:3001/transactions/completed', {
      credentials: 'include', // Include session cookies
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch completed transactions.');
        }
        return res.json();
      })
      .then((data) => setTransactions(data))
      .catch((err) => {
        console.error('Error fetching completed transactions:', err);
        setError('Could not load completed transactions.');
      });
  }, []);

    // Handle filing a complaint
    const handleFileComplaint = (sellerId) => {
      fetch('http://localhost:3001/file-complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sellerId }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to file complaint.');
          }
          return res.json();
        })
        .then((data) => {
          setMessage(data.message);
          setError('');
        })
        .catch((err) => {
          console.error('Error filing complaint:', err);
          setError('Could not file complaint.');
          setMessage('');
        });
    };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Completed Transactions</h2>
      {error && <p className="text-red-500">{error}</p>}
      {transactions.length === 0 ? (
        <p>No completed transactions.</p>
      ) : (
        transactions.map((transaction) => (
          <div key={transaction.transaction_id} className="p-4 bg-white shadow-md mb-4 rounded">
            <h3 className="text-lg font-bold">Transaction #{transaction.transaction_id}</h3>
            <p>Listing Title: {transaction.listing_title}</p>
            <p>Seller: {transaction.seller_name}</p>
            <p>Amount: ${transaction.amount}</p>
            <p>Status: {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</p>
            <button
              onClick={() => handleFileComplaint(transaction.seller_id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-2"
            >
              File Complaint
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default CompletedTransactions;