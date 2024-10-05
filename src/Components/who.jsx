import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaUserTie } from 'react-icons/fa'; // Importing icons

export default function WhoAmI() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-[#6F4C3E] text-5xl font-bold mb-12 shadow-lg">Who are you?</h1>
      <div className="flex space-x-8">
        <Link to="/login/user">
          <div className="flex flex-col items-center p-8 bg-[#D9BFA1] rounded-lg shadow-lg text-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
            <FaUser size={100} className="mb-4 text-[#6F4C3E] transition-transform transform hover:scale-125" />
            <h2 className="text-xl font-semibold text-[#6F4C3E]">Patient</h2>
          </div>
        </Link>
        <Link to="/login/staff">
          <div className="flex flex-col items-center p-8 bg-[#D9BFA1] rounded-lg shadow-lg text-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
            <FaUserTie size={100} className="mb-4 text-[#6F4C3E] transition-transform transform hover:scale-125" />
            <h2 className="text-xl font-semibold text-[#6F4C3E]">Staff</h2>
          </div>
        </Link>
      </div>
    </div>
  );
}
