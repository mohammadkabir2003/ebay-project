// Footer.js
import React from "react";
import { Link } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa";

function Footer() {
  const linkedinProfiles = [
    "https://linkedin.com/in/johndoe", // Replace with actual LinkedIn URLs
    "https://linkedin.com/in/janesmith",
  ];

  return (
    <footer className="bg-white py-8">
      <div className="flex justify-between items-center h-20 max-w-[1240px] mx-auto px-6 text-black font-bold">
        {/* Left Section: E-BIDDING Button and LinkedIn Profiles */}
        <div className="flex flex-col space-y-4">
          <button className="text-lg font-bold p-2 bg-blue-300 rounded-md hover:bg-blue-500">
            E-BIDDING
          </button>
          <div className="flex space-x-4 mt-auto">
            {linkedinProfiles.map((profile, index) => (
              <a
                key={index}
                href={profile}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500"
              >
                <FaLinkedin size={24} />
              </a>
            ))}
          </div>
        </div>

        {/* Right Section: Vertical Navbar Links */}
        <div className="flex flex-col space-y-4">
          <Link to="/" className="hover:text-gray-400">
            Home
          </Link>
          <Link to="/profile" className="hover:text-gray-400">
            Profile
          </Link>
          <Link to="/contact" className="hover:text-gray-400">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
