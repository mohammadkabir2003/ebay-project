import React, { useState, useEffect } from "react";
import { IoMenu } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if the user is logged in

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

          {isLoggedIn ? (
            // Show Profile button if logged in
            <Link to="/profile">
              <button className="p-4">Profile</button>
            </Link>
          ) : (
            // Show Login/Signup button if not logged in
            <Link to="/auth">
              <button className="p-4">Login/Signup</button>
            </Link>
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
