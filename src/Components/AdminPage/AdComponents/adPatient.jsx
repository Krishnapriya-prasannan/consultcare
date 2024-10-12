import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdPatient = () => {
  const [patients, setPatients] = useState([]); // Removed static patient data
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('regno');
  const [confirmation, setConfirmation] = useState(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    const patient = patients.find((p) =>
      searchField === 'regno'
        ? p.regno === searchTerm
        : searchField === 'phone'
        ? p.phone === searchTerm
        : p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // If you want to set selectedPatient, you can uncomment the following line
    // setSelectedPatient(patient || null);
  };

  const handleEdit = (id) => {
    navigate('/userpage/profile');
  };

  const handleAddPatient = () => {
    const newId = Date.now(); // Generate a unique ID
    navigate('/signup', { state: { fromPatientManagement: true } });
   //navigate('/signup'); // Redirect to the new patient's profile page
  };

  const deletePatient = (id) => {
    const updatedPatients = patients.filter((p) => p.id !== id);
    setPatients(updatedPatients);
    setConfirmation(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="container mx-auto bg-[#E6CCB2] p-6 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Patient Management</h1>

        {/* Search Section and Add Patient Button */}
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
            onClick={handleAddPatient} // Redirect to the new patient profile page
            className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded mr-2 transition duration-300 transform hover:scale-105 w-full md:w-auto mt-4 md:mt-0"
          >
            Add Patient
          </button>
        </div>

        {/* Patient List Section */}
        <div className="bg-white p-4 rounded-md shadow-md mt-6">
          <h2 className="text-lg font-semibold mb-4">Patient List</h2>
          <ul className="space-y-2">
            {patients.length ? (
              patients.map((patient) => (
                <li
                  key={patient.id}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded-md hover:bg-gray-100"
                >
                  <span>{`${patient.name} (RegNo: ${patient.regno}, Age: ${patient.age}, Sex: ${patient.sex}, Phone: ${patient.phone})`}</span>
                  <div className="flex space-x-2">
                    <button
                      className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded mr-2 transition duration-300 transform hover:scale-105 w-full md:w-auto"
                      onClick={() => handleEdit(patient.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded mr-2 transition duration-300 transform hover:scale-105 w-full md:w-auto"
                      onClick={() =>
                        setConfirmation({
                          id: patient.id,
                          message: `Are you sure you want to delete ${patient.name} (ID: ${patient.id})?`,
                        })
                      }
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No patients found.</li>
            )}
          </ul>
        </div>

        {/* Delete Confirmation Modal */}
        {confirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md shadow-lg">
              <p>{confirmation.message}</p>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded mr-2 transition duration-300 transform hover:scale-105"
                  onClick={() => deletePatient(confirmation.id)}
                >
                  Confirm
                </button>
                <button
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2 transition duration-300 transform hover:scale-105"
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
