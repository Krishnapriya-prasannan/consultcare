import React, { useState } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'; // Importing icons for the toggle button

const LeftSideNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
    console.log("Navbar is now: ", isOpen ? "Closed" : "Open"); // Debug log to track state
  };

  return (
    <div className="flex">
      {/* Toggle Button for Mobile */}
      <button
        onClick={toggleNavbar}
        className="md:hidden bg-[#B08968] text-white p-2 rounded focus:outline-none flex items-center"
      >
        {isOpen ? (
          <AiOutlineClose size={24} /> // Close icon
        ) : (
          <AiOutlineMenu size={24} /> // Hamburger icon
        )}
      </button>

      {/* Sidebar - always visible for debugging */}
      <div
        className={`bg-[#B08968] min-h-screen p-4 text-white w-64 ${
          'translate-x-0' // Sidebar always visible for now
        } md:block`}
      >
        <h1 className="text-2xl font-bold mb-8">Menu</h1>
        <ul>
          <li className="mb-4">
            <a href="#profile" className="hover:text-gray-200">Profile</a>
          </li>
          <li className="mb-4">
            <a href="#book-appointment" className="hover:text-gray-200">Book Appointment</a>
          </li>
          <li className="mb-4">
            <a href="#prescription" className="hover:text-gray-200">Prescription</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeftSideNavbar;