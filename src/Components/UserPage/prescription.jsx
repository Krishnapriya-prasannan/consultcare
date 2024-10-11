import React, { useEffect, useState } from 'react';

const Prescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch prescription data from backend API
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/prescriptions'); // Replace with your API URL
        if (!response.ok) {
          throw new Error('Failed to fetch prescriptions');
        }
        const data = await response.json(); // Assuming the API sends JSON data
        setPrescriptions(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []); // Empty array ensures it runs only once

  return (
    <div className="p-4">
      <table className="w-full text-left bg-[#CB997E] rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="p-2 border-b-2 border-gray-200">Sr No</th>
            <th className="p-2 border-b-2 border-gray-200">Doctor Name</th>
            <th className="p-2 border-b-2 border-gray-200">Date</th>
            <th className="p-2 border-b-2 border-gray-200">View</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="p-4 text-center">Loading...</td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="4" className="p-4 text-center">Error: {error}</td>
            </tr>
          ) : prescriptions.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-4 text-center">No prescriptions available</td>
            </tr>
          ) : (
            prescriptions.map((prescription, index) => (
              <tr key={prescription.id} className="hover:bg-[#D8A48F] transition-colors">
                <td className="p-2 border-b border-gray-200">{index + 1}</td>
                <td className="p-2 border-b border-gray-200">{prescription.doctorName}</td>
                <td className="p-2 border-b border-gray-200">{prescription.date}</td>
                <td className="p-2 border-b border-gray-200">
                  <button
                    onClick={() => alert(`Viewing prescription with ID: ${prescription.id}`)}
                    className="bg-[#B08968] text-white px-4 py-2 rounded shadow hover:bg-[#8C6C51] transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Prescription;
