import React, { useState } from 'react';

const AppointmentManagement = () => {
  const [filterOption, setFilterOption] = useState('doctorName');
  const [filterValue, setFilterValue] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    id: '',
    doctorName: '',
    patientName: '',
    date: '',
    speciality: '',
    status: 'waiting',
    time: 'available',
  });

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
    if (confirmDelete) {
      setAppointments(appointments.filter(appointment => appointment.id !== id));
    }
  };

  const handleEdit = (id) => {
    setEditingAppointmentId(id === editingAppointmentId ? null : id);
  };

  const handleUpdateAppointment = (id, updatedFields) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, ...updatedFields } : appointment
    ));
    setEditingAppointmentId(null);
  };

  const handleAddAppointment = () => {
    setAppointments([...appointments, { ...newAppointment, id: appointments.length + 1 }]);
    setNewAppointment({ id: '', doctorName: '', patientName: '', date: '', speciality: '', status: 'waiting', time: 'available' });
    setIsAddingAppointment(false);
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filterOption === 'doctorName') {
      return filterValue === '' || appointment.doctorName.includes(filterValue);
    } else if (filterOption === 'patientName') {
      return filterValue === '' || appointment.patientName.includes(filterValue);
    } else if (filterOption === 'date') {
      return filterValue === '' || appointment.date === filterValue;
    }
    return true;
  });

  return (
    <div className="min-h-screen p-4 bg-[#E6CCB2]">
      <h1 className="text-center text-3xl font-semibold mb-6">Appointment Management</h1>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <select
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className="p-2 border rounded-md w-full md:w-1/4"
        >
          <option value="doctorName">Filter by Doctor Name</option>
          <option value="patientName">Filter by Patient Name</option>
          <option value="date">Filter by Date</option>
        </select>

        <input
          type={filterOption === 'date' ? 'date' : 'text'}
          placeholder={`Enter ${filterOption === 'doctorName' ? 'Doctor Name' : filterOption === 'patientName' ? 'Patient Name' : 'Date'}`}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="p-2 border rounded-md w-full md:w-3/4"
        />
      </div>

      {/* Appointment List */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse bg-white">
          <thead className="bg-gray-300">
            <tr>
              <th className="p-2 border">Appointment ID</th>
              <th className="p-2 border">Doctor Name</th>
              <th className="p-2 border">Patient Name</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Speciality</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Time</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id} className="text-center">
                <td className="p-2 border">{appointment.id}</td>
                <td className="p-2 border">
                  {editingAppointmentId === appointment.id ? (
                    <input
                      type="text"
                      value={appointment.doctorName}
                      onChange={(e) => handleUpdateAppointment(appointment.id, { doctorName: e.target.value })}
                      className="p-1 border rounded"
                    />
                  ) : appointment.doctorName}
                </td>
                <td className="p-2 border">
                  {editingAppointmentId === appointment.id ? (
                    <input
                      type="text"
                      value={appointment.patientName}
                      onChange={(e) => handleUpdateAppointment(appointment.id, { patientName: e.target.value })}
                      className="p-1 border rounded"
                    />
                  ) : appointment.patientName}
                </td>
                <td className="p-2 border">
                  {editingAppointmentId === appointment.id ? (
                    <input
                      type="date"
                      value={appointment.date}
                      onChange={(e) => handleUpdateAppointment(appointment.id, { date: e.target.value })}
                      className="p-1 border rounded"
                    />
                  ) : appointment.date}
                </td>
                <td className="p-2 border">
                  {editingAppointmentId === appointment.id ? (
                    <input
                      type="text"
                      value={appointment.speciality}
                      onChange={(e) => handleUpdateAppointment(appointment.id, { speciality: e.target.value })}
                      className="p-1 border rounded"
                    />
                  ) : appointment.speciality}
                </td>
                <td className="p-2 border">
                  {editingAppointmentId === appointment.id ? (
                    <select
                      value={appointment.status}
                      onChange={(e) => handleUpdateAppointment(appointment.id, { status: e.target.value })}
                      className="p-1 border rounded"
                    >
                      <option value="waiting">Waiting</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : appointment.status}
                </td>
                <td className="p-2 border">
                  {editingAppointmentId === appointment.id ? (
                    <input
                      type="text"
                      value={appointment.time}
                      onChange={(e) => handleUpdateAppointment(appointment.id, { time: e.target.value })}
                      className="p-1 border rounded"
                    />
                  ) : appointment.time}
                </td>
                <td className="p-2 border">
                  <button
                    className={`text-blue-500 hover:underline mr-2 ${editingAppointmentId === appointment.id ? 'enabled' : 'disabled'}`}
                    onClick={() => handleEdit(appointment.id)}
                    disabled={editingAppointmentId !== appointment.id && editingAppointmentId !== null}
                  >
                    {editingAppointmentId === appointment.id ? 'Save' : 'Edit'}
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(appointment.id)}
                    disabled={editingAppointmentId !== null}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Appointment Section */}
      {isAddingAppointment && (
        <div className="mt-6 p-4 border rounded-md bg-white">
          <h2 className="text-xl mb-4">Add New Appointment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Doctor Name"
              value={newAppointment.doctorName}
              onChange={(e) => setNewAppointment({ ...newAppointment, doctorName: e.target.value })}
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Patient Name"
              value={newAppointment.patientName}
              onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
              className="p-2 border rounded-md"
            />
            <input
              type="date"
              value={newAppointment.date}
              onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Speciality"
              value={newAppointment.speciality}
              onChange={(e) => setNewAppointment({ ...newAppointment, speciality: e.target.value })}
              className="p-2 border rounded-md"
            />
            <select
              value={newAppointment.status}
              onChange={(e) => setNewAppointment({ ...newAppointment, status: e.target.value })}
              className="p-2 border rounded-md"
            >
              <option value="waiting">Waiting</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input
              type="text"
              placeholder="Time (Available/Open)"
              value={newAppointment.time}
              onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
              className="p-2 border rounded-md"
            />
          </div>
          <button onClick={handleAddAppointment} className="mt-6 bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105">
            Add Appointment
          </button>
        </div>
      )}

      <button onClick={() => setIsAddingAppointment(!isAddingAppointment)} className="mt-6 bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105">
        {isAddingAppointment ? 'Cancel' : 'Add New Appointment'}
      </button>
    </div>
  );
};

export default AppointmentManagement;
