import React from 'react'
import Navbar from '../components/Navbar'
import { useEffect } from 'react'
import { useState } from 'react'

const Rating = () => {
    //const [pendingUsers, setPendingUsers] = useState([]);
    const [pendingBuyers, setPendingBuyers] = useState([]);
    const [pendingSellers, setPendingSellers] = useState([]);
    const [userDetails, setUserDetails] = useState(null);
    const [ratingBuyer, setRatingBuyer] = useState(new Map());
    const [ratingSeller, setRatingSeller] = useState(new Map());
    //get transaction id ==> check if buyer_id == user

  // Fetch logged-in user details
    const handleRatingChangeBuyer = (transactionId, buyerId, rating) => {
    setRatingBuyer((prev) => {
        // Copy the previous Map to avoid modifying state directly
        const updatedRatings = new Map(prev);
        updatedRatings.set(transactionId, { buyerId, rating }); // Map transaction_id to an object with buyerId and rating
        return updatedRatings; // Return the updated Map
            });
    };

    const handleRatingChangeSeller = (transactionId, sellerId, rating) => {
    setRatingSeller((prev) => {
        // Copy the previous Map to avoid modifying state directly
        const updatedRatings = new Map(prev);
        updatedRatings.set(transactionId, { sellerId, rating }); // Map transaction_id to an object with sellerId and rating
        return updatedRatings; // Return the updated Map
    });
};



    const handleRateUsers = async() => {
        // Send the ratings to the server
        // One for buyer and one for seller
        const ratingsData = Array.from(ratingBuyer.entries()).map(([transactionId, { buyerId, rating }, ]) => ({
            transaction_id: transactionId,
            rater_id: userDetails.id,   // The logged-in user's ID (rater)
            ratee_id: buyerId,            // The ID of the buyer/seller
            rating: rating,        // The rating given by the rater
        }));
        const ratingsData2 = Array.from(ratingSeller.entries()).map(([transactionId, { sellerId, rating }, ]) => ({
            transaction_id: transactionId,
            rater_id: userDetails.id,   // The logged-in user's ID (rater)
            ratee_id: sellerId,            // The ID of the buyer/seller
            rating: rating,        // The rating given by the rater
        }));
        //console.log('Sending ratings:', ratingsData); // Check if data is correct
        try {
            const response = await fetch('http://localhost:3001/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ratingsData), // Sending the ratings data
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send buyer ratings.');
            }

            const data = await response.json();
            console.log('Ratings sent successfully for buyer:', data);
        } catch (err) {
            console.error('Error sending buyer ratings:', err);
        }

        try {
            const response = await fetch('http://localhost:3001/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ratingsData2), // Sending the ratings data
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send seller ratings.');
            }

            const data = await response.json();
            console.log('Ratings sent successfully for seller:', data);
            fetchTransactionBuyerDetails();
            fetchTransactionSellerDetails();
        } catch (err) {
            console.error('Error sending seller ratings:', err);
        }
    }; 
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:3001/ratings/user', {
          method: 'GET',
          credentials: 'include', // Ensures the session cookie is sent with the request
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch user details.');
        }

        const data = await response.json();
        setUserDetails(data);
        //console.log('Logged-in user ID using first data.id:', data.id); // Log the user ID
        //console.log(data);
        //console.log('Logged-in user details:', userDetails);
      } catch (err) {
        //console.error('Error fetching user details:', err);
      }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);



  //console.log('Logged-in user ID:', userDetails?.id);


    // Fetch transaction details for buyers
  const fetchTransactionBuyerDetails = async () => {
    if (!userDetails?.id) return; // Ensure userDetails is available
    try {
      const response = await fetch(`http://localhost:3001/transactions/buyers/${userDetails.id}`, {
        method: 'GET',
        credentials: 'include', // Ensures the session cookie is sent with the request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch transaction details.');
      }

      const data = await response.json();
      setPendingBuyers(data);
    } catch (err) {
      console.error('Error fetching transaction details:', err);
    }
  };

    useEffect(() => {
        if (userDetails?.id) {
            fetchTransactionBuyerDetails();
        }
        }, [userDetails]);

    const fetchTransactionSellerDetails = async () => {
    if (!userDetails?.id) return; // Ensure userDetails is available
        try {
        const response = await fetch(`http://localhost:3001/transactions/sellers/${userDetails.id}`, {
            method: 'GET',
            credentials: 'include', // Ensures the session cookie is sent with the request
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch transaction details.');
        }

        const data = await response.json();
        setPendingSellers(data);
        } catch (err) {
        console.error('Error fetching transaction details:', err);
        }
  };

    useEffect(() => {
        if (userDetails?.id) {
            fetchTransactionSellerDetails();
        }
        }, [userDetails]);



    return (
        <>
            <Navbar />

                <div className="bg-gradient-to-r from-[#CADCFC] to-[#89ABE3] h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-center mb-6">Rate Buyers</h2>

                        <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2 text-left">Name</th>
                                <th className="border border-gray-300 p-2 text-left">Username</th>
                                <th className="border border-gray-300 p-2 text-left">Email</th>
                                <th className="border border-gray-300 p-2 text-left">Transaction ID</th>
                                <th className="border border-gray-300 p-2 text-center">Rate</th>
                            </tr>
                        </thead>

                        <tbody>
                        {pendingBuyers.map((user) => (
                            <tr key={user.transaction_id} className="bg-gray-50">
                                <td className="border border-gray-300 p-2">{user.name}</td>
                                <td className="border border-gray-300 p-2">{user.username}</td>
                                <td className="border border-gray-300 p-2">{user.email}</td>
                                <td className="border border-gray-300 p-2">{user.transaction_id}</td>
                                <td className="border border-gray-300 p-2 text-center space-x-2">
                                    <select defaultValue={0}
                                        onChange={(e) => {
                                            //console.log(e.target.value, user.id);
                                            handleRatingChangeBuyer(user.transaction_id, user.id, e.target.value);
                                            //console.log(userDetails.id, userDetails.username);

                                        }} >    
                                        <option value={0} disabled></option>
                                        <option value = {1}>1</option>
                                        <option value = {2}>2</option>
                                        <option value = {3}>3</option>
                                        <option value = {4}>4</option>
                                        <option value = {5}>5</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        {pendingBuyers.length === 0 && (
                            <tr>
                            <td
                                colSpan="4"
                                className="border border-gray-300 p-2 text-center text-gray-500"
                            >
                                No pending users
                            </td>
                            </tr>
                        )}
                        </tbody>
                        </table >

                        <h2 className="text-2xl font-bold text-center mb-6 pt-10">Rate Sellers</h2>

                        <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2 text-left">Name</th>
                                <th className="border border-gray-300 p-2 text-left">Username</th>
                                <th className="border border-gray-300 p-2 text-left">Email</th>
                                <th className="border border-gray-300 p-2 text-left">Transaction ID</th>
                                <th className="border border-gray-300 p-2 text-center">Rate</th>
                            </tr>
                        </thead>

                        <tbody>
                        {pendingSellers.map((user) => (
                            <tr key={user.transaction_id} className="bg-gray-50">
                                <td className="border border-gray-300 p-2">{user.name}</td>
                                <td className="border border-gray-300 p-2">{user.username}</td>
                                <td className="border border-gray-300 p-2">{user.email}</td>
                                <td className="border border-gray-300 p-2">{user.transaction_id}</td>
                                <td className="border border-gray-300 p-2 text-center space-x-2">
                                    <select defaultValue={0}
                                        onChange={(e) => handleRatingChangeSeller(user.transaction_id, user.id, e.target.value)}>
                                        <option value={0} disabled></option>
                                        <option value = {1}>1</option>
                                        <option value = {2}>2</option>
                                        <option value = {3}>3</option>
                                        <option value = {4}>4</option>
                                        <option value = {5}>5</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        {pendingSellers.length === 0 && (
                            <tr>
                            <td
                                colSpan="4"
                                className="border border-gray-300 p-2 text-center text-gray-500"
                            >
                                No pending users
                            </td>
                            </tr>
                        )}
                        </tbody>
                        </table >

                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
                            onClick={handleRateUsers}>
                            Rate Users
                        </button>
                    </div>
                    </div>





        </>
    )
    }

export default Rating