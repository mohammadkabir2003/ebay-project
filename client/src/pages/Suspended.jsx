import React from 'react';

const Suspended = () => {
  return (
    <div className="bg-gradient-to-r from-[#CADCFC] to-[#89ABE3] h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
            <h1 className='text-9xl font-bold mb-14'>403</h1>
            <h2 className="text-2xl font-bold text-center mb-6 text-red-600">Account Suspended</h2>
            <p>Your account has been suspended by the admin. Please contact support for further details or pay fine</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6">
                Pay Fine
            </button>
        </div>
    </div>
  );
};

export default Suspended;
