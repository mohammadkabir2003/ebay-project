import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Listing from '../components/Listing';
import { Link } from 'react-router-dom';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3001/listings', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log('Response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Received data:', data);
        setListings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Detailed error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className='flex justify-center my-8'>
        <Link to="/add-listing">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-100 transition duration-300">Create Listing</button>
        </Link>
      </div>
      <div className="listings-container">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && listings.length === 0 ? (
          <p>No listings found</p>
        ) : (
        <div className="flex flex-row justify-center mx-2 flex-wrap"> {/* Flex container with negative margin */}
            {listings.map(listing => (
              <div key={listing.id} className="w-1/6 mx-6 mb-8"> {/* Card wrapper */}
                <Listing listing={listing} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Listings;