import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DocPatient = ({ patientsData }) => {
  const navigate = useNavigate();

  // Search-related state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('name');

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
      return patient.phoneNumber.includes(searchQuery);
    }
    return false;
  });

  const viewPatientHistory = (regNo) => {
    navigate(`/patient-history/${regNo}`);
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
          <option value="phoneNumber">Phone Number</option>
        </select>
      </div>

      <table className="min-w-full bg-[#DDB892] shadow-md rounded">
        <thead className="bg-[#7F4F24] text-white">
          <tr>
            <th className="p-2 text-left">Reg No</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Age</th>
            <th className="p-2 text-left">Sex</th>
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
