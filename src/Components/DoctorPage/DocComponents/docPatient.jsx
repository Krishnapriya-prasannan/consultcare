import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DocPatient = () => {
  const navigate = useNavigate();

  // Search-related state
  const [patientsData, setPatientsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('name');
  const staffId = localStorage.getItem('staff_id');

  useEffect(() => {
    // Fetch patients data when component mounts
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patients/${staffId}`);
        setPatientsData(response.data);
      } catch (error) {
        console.error("Error fetching patients data:", error);
      }
    };

    fetchPatients();
  }, [staffId]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };
  


  // Filtering patients based on search and filter type
  const filteredPatients = patientsData?.filter((patient) => {
    if (filterType === 'name') {
      return patient.name.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (filterType === 'regNo') {
      return patient.regNo.includes(searchQuery);
    } else if (filterType === 'phoneNumber') {
      return patient.phoneNumber.includes(searchQuery); // Updated
    }
    return false;
  });

  const viewPatientHistory = (regNo) => {
    localStorage.setItem('regno', regNo);
    navigate(`/doctorpage/patient/history`);
  };

  return (
    <div className="p-6 bg-[#FDF6E3] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-[#7F5539]">Patient List</h1>

      <div className="flex items-center mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder={`Search by ${filterType}`}
          className="border border-gray-400 p-2 rounded mr-2 bg-[#DDB892]"
        />
        <select
          value={filterType}
          onChange={handleFilterChange}
          className="border border-gray-400 p-2 rounded bg-[#DDB892]"
        >
          <option value="name">Name</option>
          <option value="regNo">Registration Number</option>
          <option value="phoneNumber">Phone Number</option> {/* Updated */}
        </select>
      </div>

      <table className="min-w-full bg-[#DDB892] shadow-md rounded">
        <thead className="bg-[#7F4F24] text-white">
          <tr>
            <th className="p-2 text-left">Reg No</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Age</th>
            <th className="p-2 text-left">Sex</th>
            <th className="p-2 text-left">Phone Number</th> {/* Updated */}
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients?.map((patient) => (
            <tr key={patient.regNo} className="border-b">
              <td className="p-2 text-center border">{patient.regNo}</td>
              <td className="p-2 text-left border">{patient.name}</td>
              <td className="p-2 text-center border">{patient.age}</td>
              <td className="p-2 text-center border">{patient.sex}</td>
              <td className="p-2 text-center border">{patient.phoneNumber}</td> {/* Updated */}
              <td className="p-2 text-center border">
                <button
                  onClick={() => viewPatientHistory(patient.regNo)}
                  className="bg-[#7F5539] text-white p-2 rounded"
                >
                  View History
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocPatient;
