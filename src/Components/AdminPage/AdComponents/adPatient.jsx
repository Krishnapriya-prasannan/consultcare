import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdPatient = () => {
  const [patients, setPatients] = useState(() => {
    const savedPatients = localStorage.getItem('patients');
    return savedPatients ? JSON.parse(savedPatients) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('regno');
  const [confirmation, setConfirmation] = useState(null);
  const navigate = useNavigate();

  const getFlagBySearchField = () => {
    switch (searchField) {
      case 'regno':
        return 3;
      case 'phone':
        return 4;
      case 'name':
        return 2;
      default:
        return 1; // Default to search by RegNo
    }
  };

  const handleSearch = async () => {
    const flag = getFlagBySearchField();
    const searchValue = searchTerm.trim();

    try {
      const response = await fetch(`http://localhost:5000/api/patients?flag=${flag}&searchValue=${searchValue}`);
      const data = await response.json();

      if (response.ok) {
        setPatients(data);
        localStorage.setItem('patients', JSON.stringify(data));
      } else {
        console.error('Error fetching patients:', data.message);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const fetchPatients = async (flag = 1) => {
    try {
      const response = await fetch(`http://localhost:5000/api/patients?flag=${flag}`);
      const data = await response.json();

      if (response.ok) {
        setPatients(data);
        localStorage.setItem('patients', JSON.stringify(data));
      } else {
        console.error('Error fetching patients:', data.message);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleEdit = (id) => {
    localStorage.setItem('patient_id',id);
    console.log('Navigating to profile with patient ID:', id);
    navigate('/admin/patientprofile');
  };

  const handleAddPatient = () => {
    navigate('/signup', { state: { fromPatientManagement: true } });
  };

  const handleDelete = async (id, regNo) => {
    try {
      const response = await fetch(`http://localhost:5000/api/patients/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update the patient status to 'L' (Locked) in the local state
        setPatients((prevPatients) =>
          prevPatients.map((p) =>
            p.pat_id === id ? { ...p, pat_status: 'L' } : p
          )
        );
        localStorage.setItem('patients', JSON.stringify(patients));
        alert('Patient status changed to Locked successfully.');
      } else {
        const errorData = await response.json();
        alert(`Error deleting patient: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Failed to delete patient. Please try again later.');
    }
    setConfirmation(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'A':
        return 'Active';
      case 'L':
        return 'Locked';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="container mx-auto bg-[#E6CCB2] p-6 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Patient Management</h1>

        <div className="flex flex-col md:flex-row justify-center items-center md:space-x-4 mb-6">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="border border-gray-300 p-2 rounded-md mb-4 md:mb-0 w-full md:w-auto"
          >
            <option value="regno">Search by RegNo</option>
            <option value="phone">Search by Phone</option>
            <option value="name">Search by Name</option>
          </select>
          <input
            type="text"
            placeholder="Enter search term"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full md:w-1/2 mb-4 md:mb-0"
          />
          <button
            onClick={handleSearch}
            className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded mr-2 transition duration-300 transform hover:scale-105 w-full md:w-auto"
          >
            Search
          </button>

          <button
            onClick={handleAddPatient}
            className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded mr-2 transition duration-300 transform hover:scale-105 w-full md:w-auto mt-4 md:mt-0"
          >
            Add Patient
          </button>
        </div>

        <div className="bg-white p-4 rounded-md shadow-md mt-6">
          <h2 className="text-lg font-semibold mb-4">Patient List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-md">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left border-b border-gray-200">Name</th>
                  <th className="py-3 px-4 text-left border-b border-gray-200">RegNo</th>
                  <th className="py-3 px-4 text-left border-b border-gray-200">Date of Birth</th>
                  <th className="py-3 px-4 text-left border-b border-gray-200">Sex</th>
                  <th className="py-3 px-4 text-left border-b border-gray-200">Phone</th>
                  <th className="py-3 px-4 text-left border-b border-gray-200">Status</th>
                  <th className="py-3 px-4 text-center border-b border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.length ? (
                  patients.map((patient) => (
                    <tr key={patient.pat_id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b border-gray-200">{patient.pat_name}</td>
                      <td className="py-3 px-4 border-b border-gray-200">{patient.pat_reg_no}</td>
                      <td className="py-3 px-4 border-b border-gray-200">{formatDate(patient.pat_dob)}</td>
                      <td className="py-3 px-4 border-b border-gray-200">{patient.pat_sex}</td>
                      <td className="py-3 px-4 border-b border-gray-200">{patient.pat_ph_no}</td>
                      <td className="py-3 px-4 border-b border-gray-200">{getStatusText(patient.pat_status)}</td>
                      <td className="py-3 px-4 border-b border-gray-200 text-center">
                        <button
                          className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded mr-2 transition duration-300 transform hover:scale-105"
                          onClick={() => handleEdit(patient.pat_id)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded mr-2 transition duration-300 transform hover:scale-105"
                          onClick={() =>
                            setConfirmation({
                              id: patient.pat_id,
                              regNo: patient.pat_reg_no,
                              message: `Are you sure you want to change the status of ${patient.pat_name} (RegNo: ${patient.pat_reg_no}) to Locked?`,
                            })
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                     <td className="py-3 px-4 border-b border-gray-200 text-center" colSpan="7">
                      No patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {confirmation && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">{confirmation.message}</h3>
              <div className="flex justify-end">
                <button
                  className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded mr-2 transition duration-300 transform hover:scale-105"
                  onClick={() => handleDelete(confirmation.id, confirmation.regNo)}
                >
                  Yes, Lock
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-500 text-black font-bold py-2 px-4 rounded"
                  onClick={() => setConfirmation(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdPatient;