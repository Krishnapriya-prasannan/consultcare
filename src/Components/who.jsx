import React from 'react';
import { Link } from 'react-router-dom';
import userIcon from '../assets/user.jpg'; // Adjust this path to your actual file

export default function WhoAmI() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex flex-col justify-center items-center">
      <h1 className="text-white text-4xl font-bold mb-8">Who are you?</h1>
      <div className="flex space-x-8">
        <Link to="/login/user">
          <div className="p-8 bg-white rounded-lg shadow-lg text-center cursor-pointer hover:shadow-2xl transition-all duration-300">
            <img
              src={userIcon} 
              alt="User Icon"
              className="mx-auto mb-4 rounded-full w-24 h-24" 
            />
            <h2 className="text-lg font-semibold">Patient</h2>
          </div>
        </Link>
        <Link to="/login/staff">
          <div className="p-8 bg-white rounded-lg shadow-lg text-center cursor-pointer hover:shadow-2xl transition-all duration-300">
            <img
              src={userIcon} 
              alt="Staff Icon"
              className="mx-auto mb-4 rounded-full w-24 h-24" 
            />
            <h2 className="text-lg font-semibold">Staff</h2>
          </div>
        </Link>
      </div>
    </div>
  );
}
