import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './bookappmodal'; // Import the Modal component

const AppointmentManagement = () => {
    const [filterOption, setFilterOption] = useState('doctorName');
    const [filterValue, setFilterValue] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [editingAppointmentId, setEditingAppointmentId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [newAppointment, setNewAppointment] = useState({
        doctorName: '',
        patientName: '',
        date: '',
        status: 'waiting',
        time: 'available',
        tokenNumber: '' // Add token number to the new appointment state
    });

    // Fetch appointments from API
    const fetchAppointments = async (flag, searchValue) => {
        try {
            const response = await axios.get('http://localhost:5000/api/appointments', {
                params: { flag, searchValue },
            });
            console.log('Fetched appointments:', response.data); // Log the fetched data

            // Ensure the token number is correctly mapped
            const appointmentsWithToken = response.data.map(appointment => ({
                ...appointment,
                tokenNumber: appointment.appt_tok_no || 'N/A', // Update here to use appt_tok_no
            }));

            // If filtering by date, parse the searchValue and filter appointments
            if (flag === 4 && searchValue) { // Check if filtering by date
                const searchedDate = new Date(searchValue).setHours(0, 0, 0, 0); // Set time to 00:00:00
                const filteredAppointments = appointmentsWithToken.filter(appointment => {
                    const appointmentDate = new Date(appointment.appt_date).setHours(0, 0, 0, 0); // Set time to 00:00:00
                    return appointmentDate === searchedDate; // Compare dates without time
                });
                setAppointments(filteredAppointments);
            } else {
                setAppointments(appointmentsWithToken); // No filtering applied
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const getFlag = () => {
        switch (filterOption) {
            case 'doctorName':
                return 2;
            case 'patientName':
                return 3;
            case 'date':
                return 4;
            default:
                return 1;
        }
    };

    useEffect(() => {
        fetchAppointments(1, null);
    }, []);

    const handleSearch = () => {
        const flag = getFlag();
        fetchAppointments(flag, filterValue);
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this appointment?');
        if (confirmDelete) {
            setAppointments(appointments.filter((appointment) => appointment.appt_id !== id));
        }
    };

    const handleEdit = (id) => {
        setEditingAppointmentId(id === editingAppointmentId ? null : id);
    };

    const handleUpdateAppointment = (id, updatedFields) => {
        setAppointments(
            appointments.map((appointment) =>
                appointment.appt_id === id ? { ...appointment, ...updatedFields } : appointment
            )
        );
        setEditingAppointmentId(null);
    };

    // Add a new appointment
    const handleAddAppointment = () => {
        setAppointments([...appointments, { ...newAppointment, appt_id: appointments.length + 1 }]);
        setNewAppointment({ doctorName: '', patientName: '', date: '', status: 'waiting', time: 'available', tokenNumber: '' });
        setIsModalOpen(false); // Close the modal after adding the appointment
    };

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

                <button onClick={handleSearch} className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded">
                    Search
                </button>
            </div>

            {/* Appointment List */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse bg-white">
                    <thead className="bg-gray-300">
                        <tr>
                            <th className="p-2 border">Doctor Name</th>
                            <th className="p-2 border">Patient Name</th>
                            <th className="p-2 border">Date</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Time</th>
                            <th className="p-2 border">Token Number</th> {/* Add Token Number Header */}
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment) => (
                            <tr key={appointment.appt_id} className="text-center">
                                <td className="p-2 border">{appointment.doctorName}</td>
                                <td className="p-2 border">{appointment.patientName}</td>
                                <td className="p-2 border">{new Date(appointment.appt_date).toLocaleDateString('en-GB')}</td>
                                <td className="p-2 border">{appointment.appt_status}</td>
                                <td className="p-2 border">{appointment.appt_time_slt}</td>
                                <td className="p-2 border">{appointment.tokenNumber}</td> {/* Display Token Number */}
                                <td className="p-2 border">
                                    <button
                                        className={`text-blue-500 hover:underline mr-2 ${editingAppointmentId === appointment.appt_id ? 'enabled' : 'disabled'}`}
                                        onClick={() => handleEdit(appointment.appt_id)}
                                        disabled={editingAppointmentId !== appointment.appt_id && editingAppointmentId !== null}
                                    >
                                        {editingAppointmentId === appointment.appt_id ? 'Save' : 'Edit'}
                                    </button>
                                    <button className="text-red-500 hover:underline" onClick={() => handleDelete(appointment.appt_id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add New Appointment Button */}
            <div className="mt-6">
                <button
                    onClick={() => setIsModalOpen(true)} // Open the modal
                    className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded"
                >
                    Add New Appointment
                </button>

                {/* Modal for adding new appointment */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <h2 className="text-xl mb-4">New Appointment</h2>
                    <input
                        type="text"
                        placeholder="Doctor Name"
                        value={newAppointment.doctorName}
                        onChange={(e) => setNewAppointment({ ...newAppointment, doctorName: e.target.value })}
                        className="p-2 border rounded mb-2 w-full"
                    />
                    <input
                        type="text"
                        placeholder="Patient Name"
                        value={newAppointment.patientName}
                        onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
                        className="p-2 border rounded mb-2 w-full"
                    />
                    <input
                        type="date"
                        value={newAppointment.date}
                        onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                        className="p-2 border rounded mb-2 w-full"
                    />
                    <input
                        type="text"
                        placeholder="Token Number"
                        value={newAppointment.tokenNumber}
                        onChange={(e) => setNewAppointment({ ...newAppointment, tokenNumber: e.target.value })}
                        className="p-2 border rounded mb-2 w-full"
                    />
                    <button onClick={handleAddAppointment} className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded">
                        Add Appointment
                    </button>
                </Modal>
            </div>
        </div>
    );
};

export default AppointmentManagement;
