import React from 'react';
import { FaUserMd } from 'react-icons/fa'; 
import { FaUser } from 'react-icons/fa'; 

const Header = ({ name, id }) => {
  return (
    <header className="bg-[#E6CCB2] text-[#3B2F2F] p-12 flex flex-row items-center justify-between relative">
      {/* ConsultCare Logo and Patient Information */}
      <div className="flex items-center space-x-5">
        <FaUserMd className="w-16 h-20 text-[#582F0E]" />
        <span className="text-lg font-bold">ConsultCare</span>
        <div className="flex items-center space-x-5">
          <FaUser className="w-16 h-20 text-[#7F4F24]" />
          
          <div className="flex flex-col items-start">
          <p className="text-lg-sm font-bold ">Welcome</p>
            <h1 className="text-lg font-bold">{name}</h1>
            <p className="text-sm font-bold">ID: {id}</p>
            <p className="text-sm font-bold">Name: {name}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
