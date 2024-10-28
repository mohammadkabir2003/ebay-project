import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = ({ userType }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [userBiddings, setUserBiddings] = useState([]);
  const [userListings, setUserListings] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    // Fetch data based on userType (Admin or Regular User)
    const fetchProfileData = async () => {
      try {
        // Fetch the user's info
        const userResponse = await fetch('/api/user-info');
        const userData = await userResponse.json();
        setUserInfo(userData);

        // Fetch biddings and listings only if not an admin
        if (userType !== 'admin') {
          const biddingsResponse = await fetch('/api/user-biddings');
          const biddingsData = await biddingsResponse.json();
          setUserBiddings(biddingsData);

          const listingsResponse = await fetch('/api/user-listings');
          const listingsData = await listingsResponse.json();
          setUserListings(listingsData);
        } else {
          // Fetch all users if admin
          const allUsersResponse = await fetch('/api/all-users');
          const allUsersData = await allUsersResponse.json();
          setAllUsers(allUsersData);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchProfileData();
  }, [userType]);

  return (
    <div>
      <Navbar />
      <div className="w-full min-h-screen bg-gradient-to-r from-[#CADCFC] to-[#89ABE3] py-16 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
          {/* User Profile Header */}
          {userInfo && (
            <div>
              <h2 className="text-3xl font-bold mb-4">
                {userType === 'admin' ? 'Admin Profile' : `${userInfo.name}'s Profile`}
              </h2>
              <p className="text-lg mb-6">Username: {userInfo.username}</p>
            </div>
          )}

          {/* Regular User Content */}
          {userType !== 'admin' && (
            <>
              {/* User Biddings */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">My Biddings</h3>
                {userBiddings.length > 0 ? (
                  <ul>
                    {userBiddings.map((bid, index) => (
                      <li key={index} className="p-4 border-b border-gray-200">
                        <p>Bid Amount: {bid.amount}</p>
                        <p>Item: {bid.item}</p>
                        <p>Date: {bid.date}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No biddings found.</p>
                )}
              </div>

              {/* User Listings */}
              <div>
                <h3 className="text-2xl font-semibold mb-4">My Listings</h3>
                {userListings.length > 0 ? (
                  <ul>
                    {userListings.map((listing, index) => (
                      <li key={index} className="p-4 border-b border-gray-200">
                        <p>Item: {listing.item}</p>
                        <p>Price: {listing.price}</p>
                        <p>Posted On: {listing.date}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No listings found.</p>
                )}
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
