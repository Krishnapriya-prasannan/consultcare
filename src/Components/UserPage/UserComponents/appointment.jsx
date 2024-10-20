import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaPen } from 'react-icons/fa';
import EditAppointmentModal from './Modal';

const Appointment = () => {
  const [activeTab, setActiveTab] = useState('view');
  const [speciality, setSpeciality] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [message, setMessage] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [tokenNumber, setTokenNumber] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false); // Correct naming
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Define handleModalClose function
  const handleModalClose = () => {
    setModalOpen(false); // Close the modal
    setEditingAppointment(null); // Reset the editing appointment
  };

  const handleModalSave = async (updatedAppointment) => {
    const formatDateForMySQL = (date, time) => {
        const jsDate = new Date(`${date}T${time}`); // Combine date with time
        return jsDate.toISOString().slice(0, 19).replace('T', ' '); // Converts to 'YYYY-MM-DD HH:MM:SS'
    };

    try {
        // Log the appointment data for debugging
        console.log("Updated Appointment:", updatedAppointment);

        // Check if the appointment ID is defined
        if (!updatedAppointment.appointmentId) {
            throw new Error("Appointment ID is required.");
        }

        // Extract only the starting time from the timeSlot
        const startTime = updatedAppointment.timeSlot.split('-')[0]; // Get the start time
        const formattedDate = formatDateForMySQL(updatedAppointment.appointmentDate, startTime); // Combine with appointment date

        const response = await axios.put(`http://localhost:5000/api/appointments/update/${updatedAppointment.appointmentId}`, {
            doctorId: updatedAppointment.doctorId,
            patientId: updatedAppointment.patientId,
            appointmentDate: formattedDate,  // Use the formatted date with start time
            timeSlot: startTime,              // Use only the start time
            tokenNumber: updatedAppointment.tokenNumber,
        });

        if (response.status === 200) {
            // Update the appointment directly in the state
            setAppointments((prevAppointments) => 
                prevAppointments.map((appointment) =>
                    appointment.appointmentId === updatedAppointment.appointmentId ? { 
                        ...appointment, 
                        appointmentDate: formattedDate, // Update the appointment date
                        timeSlot: startTime,           // Update the time slot
                        doctorId: updatedAppointment.doctorId, // Update doctor ID
                        patientId: updatedAppointment.patientId, // Update patient ID if needed
                        tokenNumber: updatedAppointment.tokenNumber // Update token number if needed
                    } : appointment
                )
            );
            setMessage('Appointment updated successfully.'); // Show success message
        }
    } catch (error) {
        console.error('Error updating appointment:', error);
        setMessage(error.message || 'Error updating appointment. Please try again.'); // Show error message
    } finally {
        setModalOpen(false); // Close the modal after the operation
    }
};

const startEditingAppointment = (appointment) => {
  const patientId = localStorage.getItem('patient_id'); // Get the patient ID from local storage
  const updatedAppointment = { 
    ...appointment, 
    patientId 
  }; // Add the patient ID to the appointment object
  setEditingAppointment(updatedAppointment); // Set the appointment to be edited
  setModalOpen(true); // Open the modal
};

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage('');
    if (tab === 'create') {
      resetForm();
    } else if (tab === 'view') {
      fetchAppointments(); // Fetch appointments when switching to the view tab
    }
  };

  const fetchAppointments = async (flag = 1) => {
    const patientId = localStorage.getItem('patient_id');
    if (!patientId) {
      setMessage('Error: Patient ID is missing.');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/appointments/${patientId}?flag=${flag}`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setMessage('Error fetching appointments');
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/specialties');
      setSpecialties(response.data);
    } catch (error) {
      console.error('Error fetching specialties:', error);
      setMessage('Error fetching specialties');
    }
  };

  const handleSpecialityChange = async (e) => {
    const selectedSpeciality = e.target.value;
    setSpeciality(selectedSpeciality);
    try {
      const response = await axios.get(`http://localhost:5000/api/doctors/${selectedSpeciality}`);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setMessage('Error fetching doctors. Please try again.');
    }
  };

  const fetchAvailableDates = useCallback(async () => {
    if (doctor) {
      try {
        const response = await axios.get(`http://localhost:5000/api/available-dates/${doctor}`);
        const dates = response.data.available_dates.map((entry) => new Date(entry.available_date));
        setAvailableDates(dates);
      } catch (error) {
        console.error('Error fetching available dates:', error);
      }
    } else {
      setAvailableDates([]);
    }
  }, [doctor]);

  const fetchAvailableSlots = async () => {
    if (!date || !doctor) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/available-slots/${doctor}/${date}`);
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots([]);
    }
  };

  const createOrUpdateAppointment = async (slot) => {
    const selectedDoctor = doctors.find(doc => String(doc.id) === String(doctor));
    const patientId = localStorage.getItem('patient_id');
    const appointmentData = {
      doctorId: doctor,
      doctorName: selectedDoctor ? selectedDoctor.name : 'Unknown',
      patientId: patientId,
      appointmentDate: date,
      timeSlot: `${slot.fromTime} - ${slot.toTime}`,
      tokenNumber: slot.tokenNumber,
    };
    try {
      const response = await axios.post('http://localhost:5000/api/book-appointment', appointmentData);
      setAppointments(prev => [...prev, { ...appointmentData, id: response.data.id }]);
      setMessage(`Appointment created successfully! Token Number: ${slot.tokenNumber}`);
    } catch (error) {
      console.error('Error booking appointment:', error);
      setMessage('Error booking appointment. Please try again.');
    }
    resetForm();
  };

  const renderAppointments = () => (
    <div className="appointments-list">
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <div key={appointment.id} className="mb-2 p-2 border-b border-7F5539">
            <p>
              Doctor: {appointment.doctorName || 'Unknown'},
              Date: {appointment.appointmentDate},
              Time: {appointment.timeSlot},
              Token: {appointment.tokenNumber}
            </p>
            <button onClick={() => startEditingAppointment(appointment)}>
            </button>
            <button onClick={() => cancelAppointment(appointment.id)}>
              Cancel
            </button>
          </div>
        ))
      ) : (
        <p>No appointments found.</p>
      )}
    </div>
  );

  const cancelAppointment = async (appointmentId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/appointments/cancel/${appointmentId}`);
      if (response.status === 200) {
        setMessage('Appointment cancelled successfully.');
        fetchAppointments(2); // Reload cancellable appointments after successful cancellation
      } else {
        setMessage('Failed to cancel the appointment.');
      }
    } catch (error) {
      console.error('Error canceling appointment:', error);
      setMessage('Error canceling appointment');
    }
  };

  const resetForm = () => {
    setSpeciality('');
    setDoctor('');
    setDate('');
    setAvailableSlots([]);
    setSelectedTimeSlot('');
    setEditMode(false);
    setTokenNumber('');
    setDoctors([]);
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  useEffect(() => {
    fetchAppointments(); // Auto-fetch appointments when component mounts
  }, []);

  useEffect(() => {
    if (doctor) {
      fetchAvailableDates();
    }
  }, [doctor, fetchAvailableDates]);

  useEffect(() => {
    fetchAvailableSlots();
  }, [doctor, date]);

  useEffect(() => {
    if (activeTab === 'cancel') {
      fetchAppointments(2); // Fetch appointments with flag = 2
    }
  }, [activeTab]);

  return (
    <div className="p-6 bg-EDE0D4 min-h-screen">
      <div className="flex mb-6 border-b-2 border-7F5539">
        <button className={`flex-1 py-2 text-white ${activeTab === 'view' ? 'bg-7F4F24' : 'bg-582F0E'} hover:bg-7F4F24 transition-all duration-300`} onClick={() => handleTabChange('view')}>View Appointment</button>
        <button className={`flex-1 py-2 text-white ${activeTab === 'create' ? 'bg-7F4F24' : 'bg-582F0E'} hover:bg-7F4F24 transition-all duration-300`} onClick={() => handleTabChange('create')}>Create Appointment</button>
        <button className={`flex-1 py-2 text-white ${activeTab === 'cancel' ? 'bg-7F4F24' : 'bg-582F0E'} hover:bg-7F4F24 transition-all duration-300`} onClick={() => handleTabChange('cancel')}>Cancel Appointment</button>
      </div>
      {activeTab === 'view' && (
  <div>
    {appointments.length > 0 ? (
      appointments.map((appointment) => {
        // Function to format the date to dd-mm-yyyy
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          const day = String(date.getDate()).padStart(2, '0'); // Get day and pad if needed
          const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-11) and pad
          const year = date.getFullYear(); // Get year
          return `${day}-${month}-${year}`; // Return formatted date
        };
        return (
          <div key={appointment.id} className="mb-2 p-2 border-b border-7F5539">
            <p>
              <strong>Doctor:</strong> {appointment.doctorName || 'Unknown'}<br />
              <strong>Date:</strong> {formatDate(appointment.appointmentDate)}<br /> {/* Format the date */}
              <strong>Time:</strong> {appointment.timeSlot}<br />
              <strong>Token:</strong> {appointment.tokenNumber}<br />
              <strong>Status:</strong> {appointment.status || 'Not specified'} {/* Displaying status */}
            </p>
          </div>
        );
      })
    ) : (
      <p>No appointments found.</p>
    )}
  </div>
)}


{activeTab === 'create' && (
  <div className="bg-FFE8D6 p-4 rounded-lg shadow-lg">
    <select 
      className="border-b-2 border-7F5539 mb-4 p-2 rounded" 
      onChange={handleSpecialityChange} 
      value={speciality}
    >
      <option value="">Select Speciality</option>
      {specialties.map((spec, index) => (
        <option key={index} value={spec}>{spec}</option>
      ))}
    </select>
    <select 
      className="border-b-2 border-7F5539 mb-4 mx-3 p-2 rounded" 
      onChange={(e) => {
        console.log("Selected doctor ID:", e.target.value);
        setDoctor(e.target.value);
      }} 
      value={doctor}
    >
      <option value="">Select Doctor</option>
      {doctors.map((doc, index) => (
        <option key={index} value={doc.id}>{doc.name}</option>
      ))}
    </select>
    <select 
      className="border-b-2 border-7F5539 mb-4 p-2 rounded" 
      onChange={(e) => setDate(e.target.value)} 
      value={date}
    >
      <option value="">Select Date</option>
      {availableDates.length > 0 ? (
        availableDates.map((availableDate, index) => {
          // Check if availableDate is a valid Date object
          if (!isNaN(availableDate.getTime())) {
            console.log("Rendering Date:", availableDate); // Log each date being rendered
            return (
              <option key={index} value={availableDate.toLocaleDateString('en-CA') // 'en-CA' formats to 'YYYY-MM-DD' without time zone conversion
            }>
                {availableDate.toLocaleDateString()} {/* Format the display date */}
              </option>
            );
          }
          return null; // Skip invalid dates
        })
      ) : (
        <option disabled>No available dates</option>
      )}
    </select>
    <select 
      className="border-b-2 border-7F5539 mb-4 mx-3 p-2 rounded" 
      onChange={(e) => {
        const selectedSlotValue = availableSlots.find(slot => 
          `${slot.fromTime}-${slot.toTime}` === e.target.value
        );
        setSelectedSlot(selectedSlotValue); // Set the selected slot object
        //setTokenNumber('Token_' + Math.floor(Math.random() * 1000)); // Generate a random token number
      }} 
      value={selectedSlot ? `${selectedSlot.fromTime}-${selectedSlot.toTime}` : ''} // Controlled value
    >
      <option value="">Select Time Slot</option>
      {availableSlots.map((slot, index) => (
        <option key={index} value={`${slot.fromTime}-${slot.toTime}`}>
          {`${slot.fromTime} - ${slot.toTime}`}
        </option>
      ))}
    </select>
    <button 
      className="bg-7F4F24 text-white py-2 px-4 rounded hover:bg-582F0E transition-all duration-300" 
      onClick={() => createOrUpdateAppointment(selectedSlot)} // Pass the selected slot object
    >
      Book Appointment
    </button>
  </div>
)}

{message && (
        <div className="mt-4 text-green-600">
          {message}
        </div>
      )}
{activeTab === 'cancel' && (
  <div className="p-2">
    {appointments.length > 0 ? (
      appointments.map((appointment) => {
        // Function to format the date
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          const day = String(date.getDate()).padStart(2, '0'); // Pad day
          const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
          const year = date.getFullYear();
          return `${day}-${month}-${year}`;
        };

        return (
          <div key={appointment.appointmentId} className="mb-3 p-3 border border-gray-300 rounded shadow-md flex justify-between items-center text-base">
            <p className="flex-1">
              {`${appointment.doctorName} | Date: ${formatDate(appointment.appointmentDate)} | Time: ${appointment.timeSlot} | Token: ${appointment.tokenNumber}`}
            </p>
            <div className="flex space-x-1">
              <button 
                className="bg-7F4F24 text-white py-1 px-3 rounded hover:bg-582F0E transition-all duration-300" 
                onClick={() => cancelAppointment(appointment.appointmentId)} // Pass appointment ID
              >
                Cancel
              </button>
              <button 
                className="bg-7F4F24 text-white py-1 px-3 rounded hover:bg-582F0E transition-all duration-300"
                onClick={() => startEditingAppointment(appointment)} // Edit function
              >
                Edit
              </button>
            </div>
          </div>
        );
      })
    ) : (
      <p className="text-sm text-gray-600">No appointments to cancel.</p>
    )}
  </div>
)}

<EditAppointmentModal 
  isOpen={isModalOpen} 
  appointment={appointments} 
  onClose={handleModalClose} 
  onSave={handleModalSave} 
  specialties={specialties}       // Pass specialties prop
  doctors={doctors}               // Pass doctors prop
  availableDates={availableDates} // Pass available dates prop
  availableSlots={availableSlots} // Pass available slots prop
/>
    </div>
  );
};

export default Appointment;