import React, { useState, useEffect } from 'react';
import CommentModal from './CommentModal';

const Listing = ({ listing }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [highestBid, setHighestBid] = useState(0); // Start with the minimum bid
  const [isMaxReached, setIsMaxReached] = useState(false);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch the current highest bid
    const fetchHighestBid = async () => {
      try {
        const response = await fetch(`http://localhost:3001/listings/${listing.id}/highest-bid`);
        const data = await response.json();
        setHighestBid(data.highest_bid);
  
        // Check if the maximum bid has been reached
        if (data.highest_bid == listing.max_bid) {
          setIsMaxReached(true);
        }
      } catch (error) {
        console.error('Error fetching highest bid:', error);
      }
    };
  
    useEffect(() => {
      fetchHighestBid();
    }, []);

  const handleBid = async () => {
    try {
      const response = await fetch(`http://localhost:3001/listings/${listing.id}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: parseFloat(bidAmount) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place bid.');
      }

      setMessage(`Bid placed successfully: $${bidAmount}`);
      setBidAmount('');
      fetchHighestBid(); // Refresh the highest bid
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 max-w-80 bg-gradient-to-r from-[#CADCFC] to-[#89ABE3]">
      <div className="p-4 flex flex-col justify-around max-w-400px">
        <div>
        <h3 className="text-lg font-semibold text-gray-800 truncate mb-2">
          {listing.title}
        </h3>
        
        <p className="text-sm text-gray-600 h-12 overflow-hidden mb-3">
          {listing.description}
        </p>
        
        <div className="space-y-2">
          <p className="flex justify-between text-sm">
            <span className="text-gray-500">Min Bid:</span>
            <span className="font-medium text-green-600">${listing.min_bid}</span>
          </p>
          
          <p className="flex justify-between text-sm">
            <span className="text-gray-500">Buy Now:</span>
            <span className="font-medium text-green-600">${listing.max_bid}</span>
          </p>
          
          <p className="flex justify-between text-sm">
            <span className="text-gray-500">Seller:</span>
            <span className="font-medium text-blue-600 truncate ml-2">{listing.user_name}</span>
          </p>

          <p className="flex justify-between text-sm">
              <span className="text-gray-500">Current Highest Bid:</span>
              <span className="font-medium text-blue-600">${highestBid}</span>
          </p>
          
          <div className="flex justify-between text-sm">
          <span className="text-gray-500">Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              listing.status === 'available' 
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
            </span>
          </div>
        </div>
        </div>
          {/* Enter Bid Section */}
          <div className="mt-4 space-y-2">
          <h4 className="text-md font-semibold mb-2">Place Your Bid</h4>
          <input
            type="number"
            placeholder="Enter your bid"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="border border-gray-300 p-2 w-full mb-2 rounded-md"
            disabled={isMaxReached}
          />
          <div className="flex justify-between">
          <button
            onClick={handleBid}
            className={`px-4 py-2 rounded ${
              isMaxReached ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
            disabled={isMaxReached}
          >
            {isMaxReached ? 'Max Bid Reached' : 'Place Bid'}
          </button>
         
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Comments
          </button></div>
          {isModalOpen && (
            <CommentModal
              listingId={listing.id}
              onClose={() => setIsModalOpen(false)}
            />
          )}
          {message && <p className="mt-2 text-sm text-black-500">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Listing;