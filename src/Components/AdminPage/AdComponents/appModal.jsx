import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AddAppointmentModal = ({ 
  isOpen, 
  onClose 
}) => {
  const [specialties, setSpecialties] = useState([]); // Ensure initialized as empty array
  const [doctors, setDoctors] = useState([]); // Ensure initialized as empty array
  const [availableDates, setAvailableDates] = useState([]); // Ensure initialized as empty array
  const [availableSlots, setAvailableSlots] = useState([]); // Ensure initialized as empty array

  const [specialtyId, setSpecialtyId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [patientId, setPatientId] = useState(''); // Ensure this is set appropriately
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [tokenNumber, setTokenNumber] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // For displaying success message

  useEffect(() => {
    if (isOpen) {
      fetchSpecialties();
    }
  }, [isOpen]);

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/specialties');
      setSpecialties(response.data || []); // Ensure setting to an empty array if response is undefined
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  const fetchDoctors = async (specialtyId) => {
    if (specialtyId) {
      try {
        const response = await axios.get(`http://localhost:5000/api/doctors/${specialtyId}`);
        setDoctors(response.data || []); // Ensure setting to an empty array if response is undefined
        setDoctorId('');
        setAvailableDates([]);
        setAvailableSlots([]);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    } else {
      setDoctors([]);
    }
  };

  const fetchAvailableDates = useCallback(async (doctorId) => {
    if (doctorId) {
      try {
        const response = await axios.get(`http://localhost:5000/api/available-dates/${doctorId}`);
        const dates = response.data.available_dates?.map(entry => new Date(entry.available_date)) || [];
        setAvailableDates(dates); // Ensure setting to an empty array if response is undefined
        setAppointmentDate('');
        setAvailableSlots([]);
      } catch (error) {
        console.error('Error fetching available dates:', error);
      }
    } else {
      setAvailableDates([]);
    }
  }, []);

  const fetchAvailableSlots = useCallback(async () => {
    if (appointmentDate && doctorId) {
      try {
        const response = await axios.get(`http://localhost:5000/api/available-slots/${doctorId}/${appointmentDate}`);
        setAvailableSlots(response.data || []); // Ensure setting to an empty array if response is undefined
        setTimeSlot('');
        setTokenNumber('');
      } catch (error) {
        console.error('Error fetching available slots:', error);
        setAvailableSlots([]);
      }
    } else {
      setAvailableSlots([]);
    }
  }, [appointmentDate, doctorId]);

  useEffect(() => {
    fetchAvailableSlots();
  }, [appointmentDate, doctorId, fetchAvailableSlots]);

  const handleSave = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/book-appointment', {
        doctorId,
        patientId, // Ensure this is set appropriately
        appointmentDate,
        timeSlot,
        tokenNumber,
      });

      setSuccessMessage(`Appointment booked successfully! Your token number is: ${response.data.tokenNumber}`);
    } catch (error) {
      console.error('Error booking appointment:', error);
      setSuccessMessage('Error booking appointment. Please try again.');
    }
  };

  const handleTimeSlotChange = (selectedSlot) => {
    setTimeSlot(selectedSlot);
    
    const selectedSlotData = availableSlots.find(slot => 
      `${slot.fromTime}-${slot.toTime}` === selectedSlot
    );

    if (selectedSlotData) {
      setTokenNumber(selectedSlotData.tokenNumber);
    } else {
      setTokenNumber('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-FFE8D6 p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <h2 className="text-xl mb-4">Book Appointment</h2>

        {/* Specialty Selection */}
        <div className="mb-4">
          <label className="block mb-1">Specialty:</label>
          <select 
            className="border-b-2 border-7F5539 p-2 rounded w-full" 
            onChange={(e) => {
              const selectedSpecialtyId = e.target.value;
              setSpecialtyId(selectedSpecialtyId);
              fetchDoctors(selectedSpecialtyId);
            }} 
            value={specialtyId}
          >
            <option value="">Select Specialty</option>
            {Array.isArray(specialties) && specialties.length > 0 ? (
              specialties.map((spec, index) => (
                <option key={index} value={spec}>
                  {spec}
                </option>
              ))
            ) : (
              <option value="">No specialties available</option>
            )}
          </select>
        </div>

        {/* Doctor Selection */}
        <div className="mb-4">
          <label className="block mb-1">Doctor:</label>
          <select 
            className="border-b-2 border-7F5539 p-2 rounded w-full" 
            onChange={(e) => {
              const selectedDoctorId = e.target.value;
              setDoctorId(selectedDoctorId);
              fetchAvailableDates(selectedDoctorId);
            }} 
            value={doctorId}
          >
            <option value="">Select Doctor</option>
            {Array.isArray(doctors) && doctors.length > 0 ? (
              doctors.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.name}</option>
              ))
            ) : (
              <option value="">No doctors available</option>
            )}
          </select>
        </div>

        {/* Appointment Date */}
        <div className="mb-4">
          <label className="block mb-1">Appointment Date:</label>
          <select 
            className="border-b-2 border-7F5539 p-2 rounded w-full" 
            onChange={(e) => {
              const selectedDate = e.target.value;
              setAppointmentDate(selectedDate);
            }} 
            value={appointmentDate}
          >
            <option value="">Select Date</option>
            {Array.isArray(availableDates) && availableDates.length > 0 ? (
              availableDates.map((date, index) => (
                <option key={index} value={date.toLocaleDateString('en-CA')}>
                  {date.toLocaleDateString()}
                </option>
              ))
            ) : (
              <option value="">No available dates</option>
            )}
          </select>
        </div>

        {/* Time Slot Selection */}
        <div className="mb-4">
          <label className="block mb-1">Time Slot:</label>
          <select 
            className="border-b-2 border-7F5539 p-2 rounded w-full" 
            onChange={(e) => handleTimeSlotChange(e.target.value)} 
            value={timeSlot}
          >
            <option value="">Select Time Slot</option>
            {Array.isArray(availableSlots) && availableSlots.length > 0 ? (
              availableSlots.map((slot, index) => (
                <option key={index} value={`${slot.fromTime}-${slot.toTime}`}>
                  {`${slot.fromTime} - ${slot.toTime}`}
                </option>
              ))
            ) : (
              <option value="">No available slots</option>
            )}
          </select>
        </div>

        {/* Success Message */}
        {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}

        <div className="flex justify-between">
          <button 
            className="bg-7F4F24 text-white py-2 px-4 rounded hover:bg-582F0E transition-all duration-300"
            onClick={handleSave}
          >
            Book Appointment
          </button>
          <button 
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition-all duration-300" 
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAppointmentModal;
