import React, { useState } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'; // Importing icons for the toggle button

const AdLeftNav = () => {
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
            <a href="adminpage/profile" className="hover:text-gray-200">Profile</a>
          </li>
          <li className="mb-4">
            <a href="adminpage/doctor" className="hover:text-gray-200">Doctors</a>
          </li>
          <li className="mb-4">
            <a href="adminpage/patient" className="hover:text-gray-200">Patients</a>
          </li>
          <li className="mb-4">
            <a href="adminpage/appointment" className="hover:text-gray-200">Appointments</a>
          </li>
          <li className="mb-4">
            <a href="adminpage/leave" className="hover:text-gray-200">Leave</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdLeftNav;