import React, { useEffect, useState } from 'react';
import { FaUsers, FaStethoscope, FaCalendarCheck } from 'react-icons/fa'; // Importing icons

const AdHero = () => {
  // State variables to hold the fetched data
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalAppointmentsToday, setTotalAppointmentsToday] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
  };
  

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const formattedDate = getFormattedDate(); // Get the current date in YYYY-MM-DD format
        const response = await fetch(`http://localhost:5000/api/appointment-statistics?date=${formattedDate}`); // Add date param if needed
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTotalPatients(data[0].TotalActivePatients);
        setTotalDoctors(data[0].TotalActiveDoctors);
        setTotalAppointmentsToday(data[0].TotalAppointmentsBookedToday);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStatistics();
  }, []);
  // Empty dependency array to run once on mount

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-EDE0D4 p-10">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-center text-4xl font-bold text-582F0E mb-8">Welcome to the Dashboard</h1>
        <p className="text-center text-lg text-7F4F24 mb-10">
          Stay updated with your healthcare management.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center space-x-0 md:space-x-4 space-y-4 md:space-y-0">
          {/* Total Patients Card */}
          <div className="bg-DDB892 shadow-lg rounded-lg p-6 w-full md:w-1/3 transform transition duration-300 hover:shadow-xl flex flex-col items-center">
            <FaUsers className="text-6xl text-582F0E mb-4" />
            <h2 className="text-lg font-semibold text-582F0E">Total Patients</h2>
            <p className="text-5xl font-bold text-7F4F24">{totalPatients}</p>
          </div>

          {/* Total Doctors Card */}
          <div className="bg-E6CCB2 shadow-lg rounded-lg p-6 w-full md:w-1/3 transform transition duration-300 hover:shadow-xl flex flex-col items-center">
            <FaStethoscope className="text-6xl text-582F0E mb-4" />
            <h2 className="text-lg font-semibold text-582F0E">Total Doctors</h2>
            <p className="text-5xl font-bold text-9C6644">{totalDoctors}</p>
          </div>

          {/* Total Appointments Today Card */}
          <div className="bg-DDB892 shadow-lg rounded-lg p-6 w-full md:w-1/3 transform transition duration-300 hover:shadow-xl flex flex-col items-center">
            <FaCalendarCheck className="text-6xl text-582F0E mb-4" />
            <h2 className="text-lg font-semibold text-582F0E">Appointments Today</h2>
            <p className="text-5xl font-bold text-7F4F24">{totalAppointmentsToday}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdHero;
