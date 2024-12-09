import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SellerListings from './SellerProfile';
import BuyerTransaction from './BuySection';

const TransactionPage = () => {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <Navbar />
  
        {/* Main Content */}
        <div className="max-w-screen-xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Seller Listings */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4"></h2>
              <SellerListings />
            </div>
  
            {/* Buyer Transaction */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4"></h2>
              <BuyerTransaction />
            </div>
          </div>
        </div>
  
        {/* Footer */}
        <Footer />
      </div>
    );
  };
  
  export default TransactionPage;