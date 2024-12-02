import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = ({ userType }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [userBiddings, setUserBiddings] = useState([]);
  const [userListings, setUserListings] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:3000/userprofile', {
          method: 'GET',
          credentials: 'include', // Include session cookies
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch user details.');
        }

        const data = await response.json();
        setUserDetails(data); // Set the user details in state
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserDetails();
  }, []);

  const [message, setMessage] = useState('');

  const handleOptOut = async () => {
    try {
      const response = await fetch('http://localhost:3000/opt-out', {
        method: 'POST',
        credentials: 'include', // Include session cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to opt out.');
      }

      setMessage('You have successfully applied to opt-out of the system.');
      // Redirect the user or disable certain actions
    } catch (error) {
      setMessage(error.message);
    }
  };

    // Show a loading state while data is being fetched
    if (!userDetails) {
      return <p>Loading...</p>;
    }

  return (
    <div>
      <Navbar />
      <div className="w-full min-h-screen bg-gradient-to-r from-[#CADCFC] to-[#89ABE3] py-16 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
          {/* User Profile Header */}
          <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <div className="bg-gray-100 p-4 rounded shadow-md">
        <p><strong>Name:</strong> {userDetails.name}</p>
        <p><strong>Username:</strong> {userDetails.username}</p>
        <p><strong>Balance:</strong> ${userDetails.balance}</p>
      </div>

          {/* Regular User Content */}
          {userType !== 'admin' && (
            <>
              
              {/* User Biddings */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">My Biddings</h3>

              </div>

              {/* User Listings */}
              <div>
                <h3 className="text-2xl font-semibold mb-4">My Listings</h3>

              </div>

              <div className="profile">
                <h3 className="text-2xl font-semibold mb-4">System Settings</h3>
                <button
                onClick={handleOptOut}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
        Opt-Out of System
      </button>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
            </>
          )}

          {/* Admin Content */}
          {userType === 'admin' && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4">All Users</h3>
              {allUsers.length > 0 ? (
                <ul>
                  {allUsers.map((user, index) => (
                    <li key={index} className="p-4 border-b border-gray-200">
                      <p>Name: {user.name}</p>
                      <p>Username: {user.username}</p>
                      <p>Email: {user.email}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No users found.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
