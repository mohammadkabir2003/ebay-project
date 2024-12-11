import React, { useState } from 'react';

const Suspended = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePayFine = async () => {
    try {
      const response = await fetch('http://localhost:3001/pay-fine', {
        method: 'POST',
        credentials: 'include', // Send session cookie
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to process payment.');
      }

      const data = await response.json();
      setMessage(data.message);
      setError('');
    } catch (err) {
      setMessage('');
      setError(err.message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#CADCFC] to-[#89ABE3] h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className='text-9xl font-bold mb-14'>403</h1>
        <h2 className="text-2xl font-bold text-center mb-6 text-red-600">Account Suspended</h2>
        <p>Your account has been suspended by the admin. Please contact support for further details or pay fine</p>

        {message && <p className="text-green-500 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        <button
          onClick={handlePayFine}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
        >
          Pay Fine
        </button>
      </div>
    </div>
  );
};

export default Suspended;
