import React from 'react';
import { useNavigate } from 'react-router-dom';

const Chart = () => {
  const navigate = useNavigate();

  // Sample data for patient's history
  const historyData = [
    { id: 1, date: '2023-09-01' },
    { id: 2, date: '2023-10-05' },
    { id: 3, date: '2023-11-10' },
    // Add more records as needed
  ];

  // Function to handle "view" button click
  const handleView = (id) => {
    navigate(`/patient/history/${id}`);
  };

  // Function to format date as "dd-mm-yyyy"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="min-h-screen p-6 bg-[#D4A373]">
      <h1 className="text-2xl font-bold mb-4 text-[#5C4033]">Patient History</h1>
      <table className="w-full bg-[#E6CCB2] rounded-lg shadow-md">
        <thead className="bg-[#C89F72] text-[#5C4033]">
          <tr>
            <th className="p-2 text-left w-1/2">Date</th>
            <th className="p-2 text-center w-1/2">Action</th>
          </tr>
        </thead>
        <tbody>
          {historyData.map((record) => (
            <tr
              key={record.id}
              className="border-b border-[#A47551] hover:bg-[#F1D8B5] transition-colors duration-300"
            >
              <td className="p-2">{formatDate(record.date)}</td>
              <td className="p-2 text-center">
                <button
                  onClick={() => handleView(record.id)}
                  className="bg-[#8B5E3C] text-white px-4 py-2 rounded hover:bg-[#5C4033]"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Chart;
