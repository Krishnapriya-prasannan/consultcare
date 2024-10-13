import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaUserMd, FaProcedures, FaCalendarCheck, FaCalendarTimes } from 'react-icons/fa';

const items = [
  {
    title: 'Profile',
    icon: <FaUser size={30} />,
    color: '#B08968',
    path: '/adminpage/profile',
  },
  {
    title: 'Doctors',
    icon: <FaUserMd size={30} />,
    color: '#DDB892',
    path: '/adminpage/doctor',
  },
  {
    title: 'Patients',
    icon: <FaProcedures size={30} />,
    color: '#E6CCB2',
    path: '/adminpage/patient',
  },
  {
    title: 'Appointments',
    icon: <FaCalendarCheck size={30} />,
    color: '#CB997E',
    path: '/adminpage/appointment',
  },
  {
    title: 'Leave',
    icon: <FaCalendarTimes size={30} />,
    color: '#DDBEA9',
    path: '/adminpage/leave',
  },
];

const AdDash = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center space-x-0 md:space-x-4 space-y-4 md:space-y-0 p-6">
      {items.map((item, index) => (
        <Link to={item.path} key={index} className="flex flex-col items-center justify-center w-48 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105" style={{ backgroundColor: item.color }}>
          <div className="mb-4 text-white">{item.icon}</div>
          <h2 className="text-xl font-semibold text-white">{item.title}</h2>
        </Link>
      ))}
    </div>
  );
};

export default AdDash;
