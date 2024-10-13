import React, { useState, useEffect } from 'react';
import { FaPen } from 'react-icons/fa';

const DocLeave = ({ isAdmin = false }) => {
  const [leaveType, setLeaveType] = useState('');
  const [date, setDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [doctorId, setDoctorId] = useState('N/A'); // Initialize as 'N/A' for non-admins
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [editingLeave, setEditingLeave] = useState(null);
  const [activeTab, setActiveTab] = useState('view');
  const today = new Date().toISOString().split("T")[0];

  const [leaveRequests, setLeaveRequests] = useState([]); // Admin-specific leaves

  useEffect(() => {
    if (isAdmin) {
      setLeaveRequests(leaveHistory.filter(leave => leave.status === 'Applied'));
    }
  }, [leaveHistory, isAdmin]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage('');
    if (tab === 'create') {
      resetForm();
    }
  };

  const handleSubmit = () => {
    if (!leaveType || !date || !leaveReason || (isAdmin && !doctorId)) {
      setMessage('Please fill all fields.');
      return;
    }

    const newLeave = {
      id: editingLeave ? editingLeave.id : Math.random(),
      leaveType,
      date,
      leaveReason,
      status: 'Applied',
      doctorId: isAdmin ? doctorId : 'N/A', // Use entered doctor ID if admin, else 'N/A'
    };

    if (editingLeave) {
      setLeaveHistory(leaveHistory.map((leave) => (leave.id === editingLeave.id ? newLeave : leave)));
      setMessage('Leave updated successfully!');
    } else {
      setLeaveHistory((prevHistory) => [...prevHistory, newLeave]);
      setMessage('Leave applied successfully!');
    }

    resetForm();
  };

  const resetForm = () => {
    setLeaveType('');
    setDate('');
    setLeaveReason('');
    if (isAdmin) {
      setDoctorId('');
    }
    setEditingLeave(null);
    setMessage('');
  };

  const handleEdit = (leave) => {
    setLeaveType(leave.leaveType);
    setDate(leave.date);
    setLeaveReason(leave.leaveReason);
    setDoctorId(leave.doctorId);
    setEditingLeave(leave);
    setActiveTab('cancel');
    setMessage(' ');
  };

  const handleDelete = (id) => {
    setLeaveHistory(leaveHistory.filter((leave) => leave.id !== id));
    setMessage('Leave deleted successfully!');
  };

  const handleAdminAction = (id, action) => {
    const updatedLeaves = leaveHistory.map((leave) =>
      leave.id === id ? { ...leave, status: action === 'approve' ? 'Approved' : 'Rejected' } : leave
    );

    setLeaveHistory(updatedLeaves);
    setLeaveRequests(updatedLeaves.filter((leave) => leave.status === 'Applied'));
    setMessage(`Leave ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
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
          className={`flex-1 py-2 text-white ${activeTab === 'cancel' ? 'bg-7F4F24' : 'bg-582F0E'} hover:bg-7F4F24 transition-all duration-300`}
          onClick={() => handleTabChange('cancel')}
        >
          Delete/Update Leave
        </button>
        {isAdmin && (
          <button
            className={`flex-1 py-2 text-white ${activeTab === 'admin' ? 'bg-7F4F24' : 'bg-582F0E'} hover:bg-7F4F24 transition-all duration-300`}
            onClick={() => handleTabChange('admin')}
          >
            Approve/Reject Leave
          </button>
        )}
      </div>

      {message && <p className="text-brown-500 mb-4 text-center">{message}</p>}

      {activeTab === 'view' && (
        <div className="bg-FFE8D6 p-4 rounded-lg shadow-lg">
          {leaveHistory.length > 0 ? (
            leaveHistory.map((leave) => (
              <div key={leave.id} className="flex justify-between items-center mb-2 border-b border-7F5539 p-2">
                <div>
                  <p className="font-bold">{leave.leaveType}</p>
                  <p>{`Doctor ID: ${leave.doctorId}`}</p>
                  <p>{`Date: ${leave.date}`}</p>
                  <p>{`Reason: ${leave.leaveReason}`}</p>
                  <p>{`Status: ${leave.status}`}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No leave records found.</p>
          )}
        </div>
      )}

      {(activeTab === 'create' || editingLeave) && (
        <div className="bg-FFE8D6 p-4 rounded-lg shadow-lg">
          {isAdmin && (
            <div className="flex flex-col mb-4">
              <label className="mb-1">Doctor ID:</label>
              <input
                type="text"
                className="border-b-2 border-7F5539 p-2 rounded"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                placeholder="Enter Doctor ID"
              />
            </div>
          )}

          <div className="flex flex-col mb-4">
            <label className="mb-1">Leave Type:</label>
            <select
              className="border-b-2 border-7F5539 p-2 rounded"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <option value="">Select Leave Type</option>
              <option value="Full Day Leave">F</option>
              <option value="Half Day Leave: Forenoon">HF</option>
              <option value="Half Day Leave: Afternoon">HA</option>
            </select>
          </div>

          <div className="flex flex-col mb-4">
            <label className="mb-1">Date:</label>
            <input
              type="date"
              min={today}
              className="border-b-2 border-7F5539 p-2 rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onKeyDown={(e) => e.preventDefault()}
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="mb-1">Leave Reason:</label>
            <textarea
              className="border-b-2 border-7F5539 p-2 rounded"
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              rows="3"
              placeholder="Describe the reason for your leave"
            ></textarea>
          </div>

          <button
            className="bg-7F4F24 text-white py-2 px-4 rounded-lg shadow-md hover:bg-7F5539 transition-all duration-300"
            onClick={handleSubmit}
          >
            {editingLeave ? 'Update Leave' : 'Apply Leave'}
          </button>

          {editingLeave && (
            <button
              className="bg-582F0E text-white py-2 px-4 rounded-lg shadow-md hover:bg-7F5539 transition-all duration-300 ml-2"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {activeTab === 'cancel' && !editingLeave && (
        <div className="bg-FFE8D6 p-4 rounded-lg shadow-lg">
          {leaveHistory.length > 0 ? (
            leaveHistory.map((leave) => (
              <div key={leave.id} className="flex justify-between items-center mb-2 border-b border-7F5539 p-2">
                <div>
                  <p className="font-bold">{leave.leaveType}</p>
                  <p>{`Doctor ID: ${leave.doctorId}`}</p>
                  <p>{`Date: ${leave.date}`}</p>
                  <p>{`Reason: ${leave.leaveReason}`}</p>
                  <p>{`Status: ${leave.status}`}</p>
                </div>
                <div className="flex gap-4">
                  <button className="text-582F0E hover:text-7F4F24" onClick={() => handleEdit(leave)}>
                    <FaPen />
                  </button>
                  <button className="text-582F0E hover:text-7F4F24" onClick={() => handleDelete(leave.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No leave records to delete.</p>
          )}
        </div>
      )}

      {activeTab === 'admin' && isAdmin && (
        <div className="bg-FFE8D6 p-4 rounded-lg shadow-lg">
          {leaveRequests.length > 0 ? (
            leaveRequests.map((leave) => (
              <div key={leave.id} className="flex justify-between items-center mb-2 border-b border-7F5539 p-2">
                <div>
                  <p className="font-bold">{leave.leaveType}</p>
                  <p>{`Doctor ID: ${leave.doctorId}`}</p>
                  <p>{`Date: ${leave.date}`}</p>
                  <p>{`Reason: ${leave.leaveReason}`}</p>
                </div>
                <div className="flex gap-4">
                  <button
                    className="bg-582F0E text-white py-1 px-3 rounded hover:bg-7F4F24"
                    onClick={() => handleAdminAction(leave.id, 'approve')}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-582F0E text-white py-1 px-3 rounded hover:bg-7F4F24"
                    onClick={() => handleAdminAction(leave.id, 'reject')}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No pending leave requests.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DocLeave;
