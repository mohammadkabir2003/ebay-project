import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { IoMenu } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if the user is logged in
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage for user login status
    const user = localStorage.getItem('role'); // Or use 'user' key if you store user details
    setIsLoggedIn(!!user); // Set to true if user exists
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3001/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies for session handling
      });
  
      if (response.ok) {
        localStorage.removeItem('role'); // Clear user role from localStorage
        setIsLoggedIn(true); // Update state
        navigate('/auth'); // Redirect to homepage
      } else {
        console.error('Failed to log out.');
      }
    } catch (error) {
      console.error('Network error during logout:', error);
    }
  };

  const handleNav = () => {
    setNav(!nav);
  };

  const toggleLogin = () => {
    // Toggle login state for simulation purposes
    setIsLoggedIn(!isLoggedIn);
  };

  useEffect(() => {
    const links = document.querySelectorAll(".nav-link");
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = e.target.getAttribute("href").slice(1);
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      });
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handleNav);
      });
    };
  }, []);

  return (
    <div className="bg-white w-full">
      <div className="flex justify-between items-center h-20 max-w-[1240px] mx-auto px-6 text-black font-bold">
        <div className="w-40">
          <button className="p-4">E-BIDDING</button>
        </div>
        <ul className="hidden md:flex">
          <Link to="/">
            <button className="p-4">Home</button>
          </Link>
          <Link to="/contact">
            <button className="p-4">Contact</button>
          </Link>
          <Link to="/admin">
            <button className="p-4">Admin</button>
          </Link>

          {!isLoggedIn ? (
          <Link to="/auth" className="bg-green-400 px-3 py-4 rounded hover:bg-red-500">
            Signup/Login
          </Link>
        ) : (
          <>
            <Link to="/profile" className="bg-green-400 px-3 py-4 mx-2 rounded hover:bg-red-500">
              Profile Page
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
        </ul>

        {/* Mobile menu toggle */}
        <div onClick={handleNav} className="block md:hidden cursor-pointer">
          {nav ? <IoMdClose size={35} /> : <IoMenu size={35} />}
        </div>

        {/* Mobile menu */}
        <div
          className={
            nav
              ? "fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#60A5FA] ease-in-out duration-500 z-10"
              : "fixed left-[-100%]"
          }
        >
          <div className="m-4 w-20"></div>
          <ul className="font-bold">
            <li className="p-4 border-b hover:bg-blue-600">
              <a href="#banner" className="nav-link">
                Home
              </a>
            </li>
            <li className="p-4 border-b hover:bg-blue-600">
              <a href="#contact" className="nav-link">
                Contact
              </a>
            </li>
            <li className="p-4 border-b hover:bg-blue-600">
              {isLoggedIn ? (
                <Link to="/profile">Profile</Link>
              ) : (
                <Link to="/auth">Login/Signup</Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
