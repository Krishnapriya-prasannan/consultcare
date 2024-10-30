import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { FaClipboardList, FaCalendarCheck } from 'react-icons/fa';

const DocHero = () => {
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);
  
  // Assuming you store the staffId in local storage
  const staffId = localStorage.getItem('staff_id');

  useEffect(() => {
    const fetchAppointmentsCount = async () => {
      try {
        console.log('Fetching counts for staffId:', staffId); // Debugging line
        const response = await Axios.get(`http://localhost:5000/api/appointments/count/${staffId}`);
        console.log('API Response:', response.data); // Debugging line
        setTotalAppointments(response.data.totalAppointments);
        setUpcomingAppointments(response.data.upcomingAppointments);
      } catch (error) {
        console.error('Error fetching appointment counts:', error);
      }
    };

    if (staffId) { // Ensure staffId exists before calling the API
      fetchAppointmentsCount();
    } else {
      console.warn('staffId not found in local storage.');
    }
  }, [staffId]);

  return (
    <div className="bg-EDE0D4 p-10">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-582F0E">Welcome to the Dashboard</h1>
          <p className="text-lg text-7F4F24 mt-2">
            Manage your appointments and consult with ease.
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center space-x-0 md:space-x-4 space-y-4 md:space-y-0">
          {/* Total Appointments Card */}
          <div className="bg-DDB892 shadow-lg rounded-lg p-6 w-full md:w-1/3 transform transition duration-300 hover:shadow-xl flex flex-col items-center">
            <FaClipboardList className="text-6xl text-582F0E mb-4" />
            <h2 className="text-lg font-semibold text-582F0E">Total Appointments</h2>
            <p className="text-5xl font-bold text-7F4F24">{totalAppointments}</p>
          </div>

          {/* Upcoming Appointments Card */}
          <div className="bg-E6CCB2 shadow-lg rounded-lg p-6 w-full md:w-1/3 transform transition duration-300 hover:shadow-xl flex flex-col items-center">
            <FaCalendarCheck className="text-6xl text-582F0E mb-4" />
            <h2 className="text-lg font-semibold text-582F0E">Upcoming Appointments</h2>
            <p className="text-5xl font-bold text-9C6644">{upcomingAppointments}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocHero;
