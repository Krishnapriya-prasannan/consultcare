import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DocAppmt = () => {
  const [appointmentsData, setAppointmentsData] = useState([]);
  const navigate = useNavigate();
  const staffId = localStorage.getItem('staff_id'); // Assuming staff ID is stored in localStorage

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/dailyappointment/${staffId}`);
        setAppointmentsData(response.data);

      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [staffId]);

  const addChart = (tokenNo) => {
    alert(`Adding chart for token number: ${tokenNo}`);
    goToNewPage(); // Navigate to the new page after adding the chart
  };

  const goToNewPage = () => {
    navigate('/doctorpage/appointment_schedule/chart'); // Navigate to the new page
  };

  return (
    <div className="min-h-screen bg-[#FFE8D6] p-6">
      <div className=" w-full bg-[#DDB892] shadow-md rounded-md p-6 ">
        <h1 className="text-2xl font-bold mb-10 text-center text-gray-700">Appointment Schedule List</h1>

        <table className="w-full bg-[#DDB892] border border-gray-300">
          <thead>
            <tr className="bg-[#E6CCB2] text-left">
              <th className="p-3 text-center">Token No</th>
              <th className="p-3 text-center">Reg No</th>
              <th className="p-3 text-center">Name</th>
              <th className="p-3 text-center">Age</th>
              <th className="p-3 text-center">Sex</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointmentsData?.map((appointment, index) => (

              <tr key={index} className="border-b">
                <td className="p-3 text-center">{appointment.tokenNo}</td>
                <td className="p-3 text-center">{appointment.regNo}</td>
                <td className="p-3 text-center">{appointment.name}</td>
                <td className="p-3 text-center">{appointment.age}</td>
                <td className="p-3 text-center">{appointment.sex}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => addChart(appointment.tokenNo)}  // Properly handling the click
                    className="bg-[#7F4F24] hover:bg-[#7F5539] text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105"
                  >
                    Add Chart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocAppmt;
