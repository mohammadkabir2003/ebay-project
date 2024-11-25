// Auth.js
import React from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from './SignUpForm';

const Auth = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg flex flex-col items-center p-8 max-w-3xl w-full space-y-4">
        
        {/* Authentication Container */}
        <div className="flex w-full">
          {/* Login Form */}
          <div className="flex-1 px-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <input
              type="text"
              placeholder="Username"
              className="border border-gray-300 p-2 w-full mb-4 rounded-md"
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 p-2 w-full mb-4 rounded-md"
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded-md">
              Login
            </button>
          </div>

          {/* Divider */}
          <div className="border-l-2 h-auto mx-4"></div>

          
          {/* Signup Form */}
          <SignUpForm />
        </div>

        {/* Back to Home Button */}
        <Link to="/">
          <button className="text-gray-600 hover:underline text-sm mt-6 font-bold">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Auth;
