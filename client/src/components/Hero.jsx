import React from "react";
//import { ReactTyped } from "react-typed";
//import bgpic from './asset/bg_picIV.jpg'

const Hero = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-r from-[#CADCFC] to-[#89ABE3] text-white px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Welcome to E-Bidding Platform
      </h1>
      <p className="text-lg md:text-2xl max-w-2xl text-center mb-6">
        The E-Bidding platform is your ultimate destination for transparent, efficient, and secure online auctions. 
        Whether you're looking to bid on products or list items for sale, our platform offers real-time bidding, robust security measures, 
        and a user-friendly interface to enhance your experience.
      </p>
      <p className="text-lg md:text-xl max-w-xl text-center mb-6">
        With E-Bidding, you can access a wide range of categories, track your bids, and stay informed of auction results — all in one place.
      </p>
      <button className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-blue-100 transition duration-300">
        Get Started
      </button>
    </div>
  );
};

export default Hero;
