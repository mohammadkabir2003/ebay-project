import React from 'react';

const Listing = ({ listing }) => {
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
      </div>
    </div>
  );
};

export default Listing;