import React, { useEffect, useState } from 'react';
import { FaUserMd, FaUserCog } from 'react-icons/fa'; // Doctor and Settings icons
import { MdLocalHospital } from 'react-icons/md'; // Hospital logo icon for ConsultCare
import { useNavigate } from 'react-router-dom';

const DoctorHeader = () => {
  const [doctorDetails, setDoctorDetails] = useState({
    name: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const doctorName = localStorage.getItem('staff_name');
    if (doctorName) {
      setDoctorDetails({ name: doctorName });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login/staff');
  };

  const { name } = doctorDetails;

  return (
    <header className="bg-[#E6CCB2] text-[#3B2F2F] p-4 flex flex-row items-center justify-between relative">
      {/* Logo Icon, ConsultCare Name, and Doctor Icon */}
      <div className="flex items-center space-x-4">
        <MdLocalHospital className="w-14 h-14 text-[#582F0E]" /> {/* Enlarged Logo icon */}
        <span className="text-2xl font-bold">ConsultCare</span> {/* Enlarged text */}
        <FaUserMd className="w-12 h-12 text-[#582F0E]" /> {/* Doctor icon */}
        
        {/* Welcome and Name after the Doctor Icon */}
        <div className="flex flex-col items-start">
          <p className="text-xl font-bold">Welcome</p>
          <p className="text-lg font-bold">Dr. {name}</p>
        </div>
      </div>

      {/* Options Section: Settings and Logout */}
      <div className="flex items-center space-x-5">
        {/* Settings Icon */}
        <button className="flex items-center space-x-2 hover:text-[#7F4F24]">
          <FaUserCog className="w-8 h-8" /> {/* Settings icon */}
          <span className="text-lg">Settings</span>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="text-lg font-bold text-black hover:text-[#7F4F24] transition duration-300 transform hover:scale-105 w-full md:w-auto"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default DoctorHeader;

