// Auth.js
import React from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';

const Auth = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg flex flex-col items-center p-8 max-w-3xl w-full space-y-4">
        
        {/* Authentication Container */}
        <div className="flex w-full">
          {/* Login Form */}
          <LoginForm />

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
