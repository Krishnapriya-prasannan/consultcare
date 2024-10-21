import React, { useEffect, useState } from 'react';
import { FaUserCog, FaUserShield } from 'react-icons/fa'; // Admin and Settings icons
import { MdLocalHospital } from 'react-icons/md'; // Hospital logo icon for ConsultCare
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminHeader = () => {
  const [adminDetails, setAdminDetails] = useState({
    name: '',
    adminId: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const adminId = localStorage.getItem('admin_id');

    const fetchAdminDetails = async () => {
      if (adminId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/RetrieveAdmin/${adminId}`);
          const { name, adminId } = response.data;

          localStorage.setItem('adminName', name);
          localStorage.setItem('adminId', adminId);

          setAdminDetails({ name, adminId });
        } catch (error) {
          console.error('Error fetching admin details:', error);
        }
      }
    };

    fetchAdminDetails();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login/staff');
  };

  const { name, adminId } = adminDetails;

  return (
    <header className="bg-[#E6CCB2] text-[#3B2F2F] p-4 flex flex-row items-center justify-between relative">
      {/* Logo Icon, ConsultCare Name, and Admin Icon */}
      <div className="flex items-center space-x-4">
        <MdLocalHospital className="w-14 h-14 text-[#582F0E]" /> {/* Enlarged Logo icon */}
        <span className="text-2xl font-bold">ConsultCare</span> {/* Enlarged text */}
        <FaUserShield className="w-12 h-12 text-[#582F0E]" /> {/* Admin icon */}
        
        {/* Welcome, Name, and Admin ID after the Admin Icon */}
        <div className="flex flex-col items-start">
          <p className="text-xl font-bold">Welcome</p>
          <p className="text-lg font-bold">Name: {name}</p>
          <p className="text-lg font-bold">Admin ID: {adminId}</p>
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
          className="text-lg font-bold text-red-500 hover:text-red-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
