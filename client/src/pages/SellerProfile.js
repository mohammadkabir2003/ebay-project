import React, { useEffect, useState } from 'react';

const SellerListings = () => {
  const [listings, setListings] = useState([]); // State to store listings
  const [message, setMessage] = useState(''); // Success message
  const [error, setError] = useState(''); // Error message

  useEffect(() => {
    // Fetch the seller's listings
    fetch('http://localhost:3001/seller/listings', {
      credentials: 'include', // Include cookies for authentication
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch listings');
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setListings(data); // Ensure data is an array
                  // Filter out listings with status 'sold'
        setListings(data.filter((listing) => listing.status !== 'sold'));
        } else {
          throw new Error('Unexpected response format');
        }
      })
      .catch((err) => {
        console.error('Error fetching listings:', err);
        setError('Could not load your listings. Please try again later.');
      });
  }, []);

  const handleTransaction = (listingId, buyerId, amount) => {
    // Log the inputs
    console.log('Attempting transaction with:', { listingId, buyerId, amount });
  
    // Validate inputs
    if (!buyerId) {
      setError('Cannot start a transaction without a valid buyer.');
      return;
    }
  
    // Start the transaction
    fetch('http://localhost:3001/transaction/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify({ listing_id: listingId, buyer_id: buyerId, amount }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            console.error('Server error:', data); // Log the error response
            throw new Error(data.error || 'Failed to start transaction.');
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log('Transaction started successfully:', data.message);
        setMessage(data.message);
        setListings((prev) =>
          prev.map((listing) =>
            listing.listing_id === listingId
              ? { ...listing, status: 'pending' } // Update status to 'pending'
              : listing
          )
        );
      })
      .catch((err) => {
        console.error('Error starting transaction:', err);
        setError(err.message || 'Could not start transaction.');
      });
  };
  

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Listings</h2>

      {/* Display messages */}
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}

      {/* Display listings */}
      {listings.length === 0 ? (
        <p>You have no listings.</p>
      ) : (
        listings.map((listing) => (
          <div
            key={listing.listing_id}
            className={`p-4 bg-white shadow-md mb-4 rounded ${
              listing.status === 'sold' ? 'bg-gray-100' : ''
            }`}
          >
            <h3 className="text-xl font-bold">{listing.title}</h3>
            <p>{listing.description}</p>
            <p>Min Bid: ${listing.min_bid}</p>
            <p>Max Bid: ${listing.max_bid}</p>
            <p>Highest Bid: ${listing.highest_bid}</p>
            <p>Highest Bidder: {listing.highest_bidder_username || 'No bids yet'}</p>
            <p>
  Status: 
  {listing.status === 'sold' && ' Sold'}
  {listing.status === 'pending' && ' Pending'}
  {listing.status === 'available' && ' Available'}
</p>

            {/* Show transaction button only for available listings */}
            {listing.status !== 'sold' && (
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                onClick={() =>
                  handleTransaction(
                    listing.listing_id,
                    listing.highest_bidder_id, // Ensure backend includes this in the response
                    listing.highest_bid
                  )
                }
              >
                Start Transaction
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default SellerListings;
