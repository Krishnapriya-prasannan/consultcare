import React, { useState, useEffect } from 'react';
import { FaPen } from 'react-icons/fa'; // Importing a pen icon from react-icons

const Appointment = () => {
  const [activeTab, setActiveTab] = useState('view');
  const [speciality, setSpeciality] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [message, setMessage] = useState('');
  const [appointments, setAppointments] = useState([]); // To hold created appointments
  const [editingAppointment, setEditingAppointment] = useState(null); // For holding the appointment being edited
  const [editMode, setEditMode] = useState(false); // To track if we are editing
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(''); // For selected time slot during edit

  // Doctor mapping: Maps doctor IDs to names
  const doctorNames = {
    "1": "Dr. John Doe",
    "2": "Dr. Jane Smith"
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage(''); // Clear message on tab change
    if (tab === 'create') {
      resetForm(); // Reset form if switching to create appointment tab
    }
  };

  const fetchAvailableSlots = async () => {
    if (!date || !doctor) return;

    // Simulate API response for available time slots
    const simulatedResponse = [
      { timeSlot: "10:00 AM" },
      { timeSlot: "11:00 AM" },
      { timeSlot: "02:00 PM" }
    ];

    setAvailableSlots(simulatedResponse);
  };

  const createOrUpdateAppointment = async (timeSlot) => {
    const appointmentData = {
      doctorId: doctor,
      patientId: '1', // Replace with actual patient ID
      appointmentDate: date,
      timeSlot: timeSlot,
      tokenNumber: generateToken(), // Automatically generate token
    };

    if (editingAppointment) {
      // If editing an appointment, update the existing one
      setAppointments(appointments.map((appointment) =>
        appointment.id === editingAppointment.id ? { ...appointmentData, id: editingAppointment.id } : appointment
      ));
      setMessage('Appointment updated successfully!');
    } else {
      // Simulate successful appointment creation response
      setAppointments((prev) => [
        ...prev,
        { ...appointmentData, id: Math.random() } // Add appointment to the list
      ]);
      setMessage('Appointment created successfully!');
    }

    // Reset fields after creating/updating
    resetForm();
  };

  const cancelAppointment = (id) => {
    setAppointments(appointments.filter((appointment) => appointment.id !== id));
    setMessage('Appointment canceled successfully!');
  };

  const startEditingAppointment = (appointment) => {
    setDoctor(appointment.doctorId);
    setDate(appointment.appointmentDate);
    setSelectedTimeSlot(appointment.timeSlot); // Set the selected time slot for editing
    setSpeciality(''); // You might want to set speciality based on the appointment if you have that data
    setEditingAppointment(appointment); // Set the editing appointment
    setEditMode(true); // Enable edit mode
  };

  const resetForm = () => {
    setSpeciality('');
    setDoctor('');
    setDate('');
    setAvailableSlots([]);
    setEditingAppointment(null); // Reset editing appointment state
    setSelectedTimeSlot(''); // Reset selected time slot
    setEditMode(false); // Reset edit mode
  };

  const generateToken = () => {
    return Math.floor(Math.random() * 100000); // Simple token generation
  };

  useEffect(() => {
    fetchAvailableSlots();
  }, [doctor, date]);

  return (
    <div className="p-6 bg-EDE0D4 min-h-screen">
      <div className="flex mb-6 border-b-2 border-7F5539">
        <button
          className={`flex-1 py-2  text-white ${activeTab === 'view' ? 'bg-7F4F24' : 'bg-582F0E'} hover:bg-7F4F24 transition-all duration-300`}
          onClick={() => handleTabChange('view')}
        >
          View Appointment
        </button>
        <button
          className={`flex-1 py-2 text-white ${activeTab === 'create' ? 'bg-7F4F24' : 'bg-582F0E'} hover:bg-7F4F24 transition-all duration-300`}
          onClick={() => handleTabChange('create')}
        >
          Create Appointment
        </button>
        <button
          className={`flex-1 py-2  text-white ${activeTab === 'cancel' ? 'bg-7F4F24' : 'bg-582F0E'} hover:bg-7F4F24 transition-all duration-300`}
          onClick={() => handleTabChange('cancel')}
        >
          Cancel Appointment
        </button>
      </div>

      {activeTab === 'view' && (
        <div>
          
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div key={appointment.id} className="mb-2 p-2 border-b border-7F5539">
                <p>{`${doctorNames[appointment.doctorId]}, Date: ${appointment.appointmentDate}, Time: ${appointment.timeSlot}`}</p>
              </div>
            ))
          ) : (
            <p>No appointments found.</p>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="bg-FFE8D6 p-4 rounded-lg shadow-lg">
          
          <select
            className="border-b-2 border-7F5539 mb-4 p-2 rounded"
            onChange={(e) => setSpeciality(e.target.value)}
            value={speciality}
          >
            <option value="">Select Speciality</option>
            <option value="cardiology">Cardiology</option>
            <option value="neurology">Neurology</option>
          </select>
          <select
            className="border-b-2 border-7F5539 mb-4 mx-3 p-2 rounded"
            onChange={(e) => setDoctor(e.target.value)}
            value={doctor}
          >
            <option value="">Select Doctor</option>
            <option value="1">Dr. John Doe</option>
            <option value="2">Dr. Jane Smith</option>
          </select>
          <input
  type="date"
  className="border-b-2 border-7F5539 mb-4 p-2 rounded"
  onChange={(e) => setDate(e.target.value)}
  value={date}
  min={new Date().toISOString().split("T")[0]} // Set min date to today
  onKeyDown={(e) => e.preventDefault()} // Disable manual typing
/>



          {/* Conditionally render available time slots */}
          {speciality && doctor && date && (
            <div>
              <h3 className="font-bold">Available Time Slots:</h3>
              {availableSlots.length > 0 ? (
                availableSlots.map((slot) => (
                  <div key={slot.timeSlot}>
                    <button
                      onClick={() => createOrUpdateAppointment(slot.timeSlot)}
                      className="bg-9C6644 m-2 py-1 px-3 rounded-lg shadow-md hover:bg-DDB892 transition-all duration-300"
                    >
                      {slot.timeSlot}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-brown-500">{message || 'Doctor is not available for this day.'}</p>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'cancel' && (
        <div className="bg-FFE8D6 p-4 rounded-lg shadow-lg">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div key={appointment.id} className="flex justify-between items-center mb-2 mx-3">
                {editMode && editingAppointment?.id === appointment.id ? (
                  <div className="flex-1">
                    <h3 className="font-bold">Edit Appointment</h3>
                    <select
            className="border-b-2 border-7F5539 mb-4 p-2 mx-3 rounded"
            onChange={(e) => setSpeciality(e.target.value)}
            value={speciality}
          >
            <option value="">Select Speciality</option>
            <option value="cardiology">Cardiology</option>
            <option value="neurology">Neurology</option>
          </select>
                    <select
                      className="border-b-2 border-7F5539 mx-3 mb-2 p-2 rounded"
                      onChange={(e) => setDoctor(e.target.value)}
                      value={doctor}
                    >
                      <option value="">Select Doctor</option>
                      <option value="1">Dr. John Doe</option>
                      <option value="2">Dr. Jane Smith</option>
                    </select>
                    <input
  type="date"
  className="border-b-2 border-7F5539 mb-4 p-2  mx-3 rounded"
  onChange={(e) => setDate(e.target.value)}
  value={date}
  min={new Date().toISOString().split("T")[0]} // Set min date to today
/>

                    <select
                      className="border-b-2 border-7F5539 mx-3 mb-2 p-2 rounded"
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      value={selectedTimeSlot}
                    >
                      <option value="">Select Time Slot</option>
                      {availableSlots.map((slot) => (
                        <option key={slot.timeSlot} value={slot.timeSlot}>{slot.timeSlot}</option>
                      ))}
                    </select>
                    <button onClick={() => createOrUpdateAppointment(selectedTimeSlot)} className="bg-9C6644 m-2 py-1 px-3 rounded-lg shadow-md hover:bg-DDB892 transition-all duration-300">
                      Update 
                    </button>
                    <button onClick={() => resetForm()} className="bg-brown-500 m-2 py-1 px-3 rounded-lg shadow-md hover:bg-brown-700 transition-all duration-300">
                      Cancel 
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <p>{`${doctorNames[appointment.doctorId]}, Date: ${appointment.appointmentDate}, Time: ${appointment.timeSlot}`}</p>
                    <div >
                      <button
                        onClick={() => cancelAppointment(appointment.id)}
                        className="bg-9C6644 m-2 py-1 px-3 rounded-lg shadow-md hover:bg-DDB892 transition-all duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => startEditingAppointment(appointment)}
                        className="text-brown-500 hover:underline ml-2"
                      >
                        <FaPen />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No appointments found.</p>
          )}
        </div>
      )}

      {message && <p className="text-green-500">{message}</p>}
    </div>
  );
};

export default Appointment; 