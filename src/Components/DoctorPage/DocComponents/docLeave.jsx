import React, { useState, useEffect } from 'react';
import { FaPen } from 'react-icons/fa';

const DocLeave = () => {
  const [leaveType, setLeaveType] = useState('');
  const [date, setDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [editingLeave, setEditingLeave] = useState(null);
  const [activeTab, setActiveTab] = useState('view');
  const today = new Date().toISOString().split("T")[0];
  const doctorId = localStorage.getItem('staff_id');

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      const response = await fetch(`http://localhost:5000/api/leave/${doctorId}`); // Fetch history using the doctorId
      const data = await response.json();
      setLeaveHistory(data);
    };
  
    fetchLeaveHistory();
  }, [doctorId]);

  const getStatusText = (status) => {
    switch (status) {
      case 'W':
        return 'Applied';
      case 'A':
        return 'Approved';
      case 'R':
        return 'Rejected';
      default:
        return 'Unknown'; // Optional, for handling unexpected status
    }
  };

  const getLeaveTypeText = (type) => {
    switch (type) {
      case 'FD':
        return 'Full Day';
      case 'MHD':
        return 'Half Day Forenoon';
      case 'EHD':
        return 'Half Day Afternoon';
      default:
        return 'Unknown Type'; // Optional, for handling unexpected type
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage('');
    resetForm();
  };

  const handleSubmit = async () => {
    if (!leaveType || !date || !leaveReason) {
      setMessage('Please fill all fields.');
      return;
    }

    const newLeave = {
      hol_stf_id: doctorId,
      hol_type: leaveType,
      hol_date: date,
      hol_reason: leaveReason,
      hol_status: 'W',
    };

    if (editingLeave) {
      // Update leave
      await fetch(`http://localhost:5000/api/leave/${editingLeave.hol_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLeave),
      });
      setLeaveHistory((prevHistory) =>
        prevHistory.map((leave) => (leave.hol_id === editingLeave.hol_id ? { ...leave, ...newLeave } : leave))
      );
      setMessage('Leave updated successfully!');
    } else {
      // Create leave
      await fetch('http://localhost:5000/api/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLeave),
      });
      setLeaveHistory((prevHistory) => [...prevHistory, { ...newLeave, hol_id: Math.random() }]); // Use random ID for new leave
      setMessage('Leave applied successfully!');
    }

    resetForm();
  };

  const resetForm = () => {
    setLeaveType('');
    setDate('');
    setLeaveReason('');
    setEditingLeave(null);
    setMessage('');
  };

  const handleEdit = (leave) => {
    setLeaveType(leave.hol_type);
    // Ensure the date format is correct
    const formattedDate = new Date(leave.hol_date).toISOString().split('T')[0];
    setDate(formattedDate);
    setLeaveReason(leave.hol_reason);
    setEditingLeave(leave);
  };
  

  const handleDelete = async (id) => {
    console.log("Deleting leave application with ID:", id); // Add this line to check the ID

    try {
        // Send DELETE request to the server
        const response = await fetch(`http://localhost:5000/api/leave/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete the leave application.');
        }

        // Update the leaveHistory state by filtering out the deleted leave application
        setLeaveHistory(leaveHistory.filter((leave) => leave.hol_id !== id));
        setMessage('Leave deleted successfully!');
    } catch (error) {
        console.error("Error deleting leave:", error);
        setMessage('Error deleting leave application.');
    }
  };

  return (
    <div className="p-6 bg-EDE0D4 min-h-screen">
      <div className="flex mb-6 border-b-2 border-7F5539">
        <button
          className={`flex-1 py-2 text-white ${activeTab === 'view' ? 'bg-7F4F24' : 'bg-582F0E'} hover:bg-7F4F24 transition-all duration-300`}
          onClick={() => handleTabChange('view')}
        >
          View Leave History
        </button>
        <button
          className={`flex-1 py-2 text-white ${activeTab === 'create' ? 'bg-7F4F24' : 'bg-582F0E'} hover:bg-7F4F24 transition-all duration-300`}
          onClick={() => handleTabChange('create')}
        >
          Apply Leave
        </button>
        <button
          className={`flex-1 py-2 text-white ${activeTab === 'manage' ? 'bg-7F4F24' : 'bg-582F0E'} hover:bg-7F4F24 transition-all duration-300`}
          onClick={() => handleTabChange('manage')}
        >
          Manage Leave
        </button>
      </div>

      {message && <p className="text-brown-500 mb-4 text-center">{message}</p>}

      {activeTab === 'view' && (
        <div className="bg-FFE8D6 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Leave History</h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2">Date</th>
                <th className="border border-gray-200 px-4 py-2">Type</th>
                <th className="border border-gray-200 px-4 py-2">Reason</th>
                <th className="border border-gray-200 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((leave) => (
                <tr key={leave.hol_id} className="hover:bg-gray-100">
                  <td className="border border-gray-200 px-4 py-2">{new Date(leave.hol_date).toLocaleDateString()}</td>
                  <td className="border border-gray-200 px-4 py-2">{getLeaveTypeText(leave.hol_type)}</td>
                  <td className="border border-gray-200 px-4 py-2">{leave.hol_reason}</td>
                  <td className="border border-gray-200 px-4 py-2">{getStatusText(leave.hol_status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Apply Leave</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="leaveType">Leave Type:</label>
              <select
                id="leaveType"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="border border-gray-300 p-2 w-full"
                required
              >
                <option value="" disabled>Select type</option>
                <option value="FD">Full Day</option>
                <option value="MHD">Half Day Forenoon</option>
                <option value="EHD">Half Day Afternoon</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="date">Leave Date:</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                className="border border-gray-300 p-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="leaveReason">Leave Reason:</label>
              <textarea
                id="leaveReason"
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                className="border border-gray-300 p-2 w-full"
                required
              />
            </div>
            <button type="submit" className="bg-7F4F24 text-white py-2 px-4">Submit Leave</button>
          </form>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="bg-FFE8D6 p-4 rounded-lg shadow-lg mt-6">
          <h2 className="text-xl font-semibold mb-4">Manage Leave Applications</h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2">Date</th>
                <th className="border border-gray-200 px-4 py-2">Type</th>
                <th className="border border-gray-200 px-4 py-2">Reason</th>
                <th className="border border-gray-200 px-4 py-2">Status</th>
                <th className="border border-gray-200 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((leave) => (
                <tr key={leave.hol_id} className="hover:bg-gray-100">
                  <td className="border border-gray-200 px-4 py-2">{new Date(leave.hol_date).toLocaleDateString()}</td>
                  <td className="border border-gray-200 px-4 py-2">{getLeaveTypeText(leave.hol_type)}</td>
                  <td className="border border-gray-200 px-4 py-2">{leave.hol_reason}</td>
                  <td className="border border-gray-200 px-4 py-2">{getStatusText(leave.hol_status)}</td>
                  <td className="border border-gray-200 px-4 py-2">
                    <button onClick={() => handleEdit(leave)} className="bg-FFE8D6 text-brown-500 hover:underline">
                      <FaPen />
                    </button>
                    <button onClick={() => handleDelete(leave.hol_id)} className="text-brown-500 hover:underline ml-2">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {editingLeave && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Update Leave</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div className="mb-4">
                  <label className="block mb-2" htmlFor="leaveType">Leave Type:</label>
                  <select
                    id="leaveType"
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="border border-gray-300 p-2 w-full"
                    required
                  >
                    <option value="" disabled>Select type</option>
                    <option value="FD">Full Day</option>
                    <option value="MHD">Half Day Forenoon</option>
                    <option value="EHD">Half Day Afternoon</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-2" htmlFor="date">Leave Date:</label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={today}
                    className="border border-gray-300 p-2 w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2" htmlFor="leaveReason">Leave Reason:</label>
                  <textarea
                    id="leaveReason"
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    className="border border-gray-300 p-2 w-full"
                    required
                  />
                </div>
                <button type="submit" className="bg-7F4F24 text-white py-2 px-4">Update Leave</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocLeave;
