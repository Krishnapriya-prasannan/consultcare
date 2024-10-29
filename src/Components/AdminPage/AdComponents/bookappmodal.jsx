import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Modal = ({ 
  isOpen, 
  appointment, 
  onClose, 
  onSave 
}) => {
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  const [specialtyId, setSpecialtyId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [patientPhone, setPatientPhone] = useState(''); // State for patient phone number
  const [patientRegNo, setPatientRegNo] = useState(''); // State for patient registration number
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [tokenNumber, setTokenNumber] = useState('');

  // Fetch specialties when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchSpecialties();
    }
  }, [isOpen]);

  // If an appointment is provided, set the initial state
  useEffect(() => {
    if (appointment) {
      console.log('Appointment Data:', appointment); // Debugging
      setSpecialtyId(appointment.specialtyId || '');
      setDoctorId(appointment.doctorId || '');
      setPatientId(appointment.patientId || '');
      setPatientPhone(''); // Reset patient phone on appointment load
      setPatientRegNo(''); // Reset patient registration number
      setAppointmentDate(appointment.appointmentDate || '');
      setTimeSlot(appointment.timeSlot || '');
      setTokenNumber(appointment.tokenNumber || '');
      fetchDoctors(appointment.specialtyId); // Fetch doctors based on the specialty ID
      fetchAvailableDates(appointment.doctorId); // Fetch available dates based on the doctor ID
    }
  }, [appointment]);

  // Fetch specialties from API
  const fetchSpecialties = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/specialties');
      console.log('Specialties Fetched:', response.data); // Debugging
      setSpecialties(response.data); // Assuming response.data is an array of strings
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  // Fetch doctors based on the selected specialty
  const fetchDoctors = async (specialtyId) => {
    if (specialtyId) {
      try {
        const response = await axios.get(`http://localhost:5000/api/doctors/${specialtyId}`);
        console.log('Doctors Fetched:', response.data); // Debugging
        setDoctors(response.data);
        setDoctorId(''); // Reset doctor selection when specialty changes
        setAvailableDates([]); // Reset available dates
        setAvailableSlots([]); // Reset available slots
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    } else {
      setDoctors([]); // Clear doctors if no specialty is selected
    }
  };

  // Fetch available dates based on the selected doctor
  const fetchAvailableDates = useCallback(async (doctorId) => {
    if (doctorId) {
      try {
        const response = await axios.get(`http://localhost:5000/api/available-dates/${doctorId}`);
        const dates = response.data.available_dates.map(entry => new Date(entry.available_date));
        console.log('Available Dates Fetched:', dates); // Debugging
        setAvailableDates(dates);
        setAppointmentDate(''); // Reset date when doctor changes
        setAvailableSlots([]); // Reset slots on doctor change
      } catch (error) {
        console.error('Error fetching available dates:', error);
      }
    } else {
      setAvailableDates([]); // Clear available dates if no doctor is selected
    }
  }, []);

  // Fetch available slots based on selected date and doctor
  const fetchAvailableSlots = useCallback(async () => {
    if (appointmentDate && doctorId) {
      try {
        const response = await axios.get(`http://localhost:5000/api/available-slots/${doctorId}/${appointmentDate}`);
        console.log('Available Slots Fetched:', response.data); // Debugging
        setAvailableSlots(response.data);
        setTimeSlot(''); // Reset time slot when fetching new slots
        setTokenNumber(''); // Reset token number
      } catch (error) {
        console.error('Error fetching available slots:', error);
        setAvailableSlots([]); // Reset slots on error
      }
    } else {
      setAvailableSlots([]);
    }
  }, [appointmentDate, doctorId]);

  // Trigger fetching available slots when appointmentDate or doctorId changes
  useEffect(() => {
    fetchAvailableSlots();
  }, [appointmentDate, doctorId, fetchAvailableSlots]);

  // Fetch patient information by phone number
  const fetchPatientByPhone = async () => {
    if (patientPhone) {
      try {
        const response = await axios.get(`http://localhost:5000/api/patients?phone=${patientPhone}`);
        if (response.data) {
          setPatientId(response.data.pat_id);
          setPatientRegNo(response.data.pat_reg_no);
        } else {
          setPatientId('');
          setPatientRegNo('');
          // Navigate to signup if patient is not found
          navigate('/signup'); // Use navigate here instead of history
        }
      } catch (error) {
        console.error('Error fetching patient by phone:', error);
        setPatientId('');
        setPatientRegNo('');
      }
    }
  };

  // Save the updated appointment
  const handleSave = () => {
    const updatedAppointment = {
      appointmentId: appointment.appointmentId,
      specialtyId,
      doctorId,
      patientId,
      appointmentDate,
      timeSlot,
      tokenNumber,
    };
    onSave(updatedAppointment);
  };

  // Handle change of time slot
  const handleTimeSlotChange = (selectedSlot) => {
    setTimeSlot(selectedSlot);

    // Find the selected slot's token number based on the selected value
    const selectedSlotData = availableSlots.find(slot => 
      `${slot.fromTime}-${slot.toTime}` === selectedSlot
    );

    // Update token number if slot is found
    if (selectedSlotData) {
      setTokenNumber(selectedSlotData.tokenNumber); // Assuming tokenNumber is part of the slot data
    } else {
      setTokenNumber(''); // Reset token number if slot is not found
    }
  };

  if (!isOpen) return null; // Do not render if modal is not open

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-FFE8D6 p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <h2 className="text-xl mb-4">Edit Appointment</h2>

        {/* Patient Phone Input */}
        <div className="mb-4">
          <label className="block mb-1">Patient Phone:</label>
          <input
            type="text"
            className="border-b-2 border-7F5539 p-2 rounded w-full"
            value={patientPhone}
            onChange={(e) => setPatientPhone(e.target.value)}
          />
          <button
            className="mt-2 bg-7F5539 text-white py-1 px-2 rounded"
            onClick={fetchPatientByPhone}
          >
            Search Patient
          </button>
        </div>

        {/* Patient Registration Number */}
        {patientRegNo && (
          <div className="mb-4">
            <label className="block mb-1">Patient Registration Number:</label>
            <input
              type="text"
              className="border-b-2 border-7F5539 p-2 rounded w-full"
              value={patientRegNo}
              readOnly
            />
          </div>
        )}

        {/* Specialty Selection */}
        <div className="mb-4">
          <label className="block mb-1">Specialty:</label>
          <select 
            className="border-b-2 border-7F5539 p-2 rounded w-full" 
            onChange={(e) => {
              const selectedSpecialtyId = e.target.value;
              setSpecialtyId(selectedSpecialtyId);
              fetchDoctors(selectedSpecialtyId); // Fetch doctors
            }} 
            value={specialtyId}
          >
            <option value="">Select Specialty</option>
            {specialties.length > 0 ? (
              specialties.map((spec, index) => (
                <option key={index} value={spec}>
                  {spec}
                </option>
              ))
            ) : (
              <option value="" disabled>No specialties available</option>
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
              fetchAvailableDates(selectedDoctorId); // Fetch dates for the selected doctor
            }} 
            value={doctorId}
          >
            <option value="">Select Doctor</option>
            {doctors.length > 0 ? (
              doctors.map((doc, index) => (
                <option key={index} value={doc.id}>
                  {doc.name}
                </option>
              ))
            ) : (
              <option value="" disabled>No doctors available</option>
            )}
          </select>
        </div>

        {/* Date Selection */}
        <div className="mb-4">
          <label className="block mb-1">Date:</label>
          <select 
            className="border-b-2 border-7F5539 p-2 rounded w-full" 
            onChange={(e) => setAppointmentDate(e.target.value)} 
            value={appointmentDate}
          >
            <option value="">Select Date</option>
            {availableDates.length > 0 ? (
              availableDates.map((date, index) => (
                <option key={index} value={date.toISOString().split('T')[0]}>
                  {date.toLocaleDateString()}
                </option>
              ))
            ) : (
              <option value="" disabled>No available dates</option>
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
            {availableSlots.length > 0 ? (
              availableSlots.map((slot, index) => (
                <option key={index} value={`${slot.fromTime}-${slot.toTime}`}>
                  {`${slot.fromTime} - ${slot.toTime}`}
                </option>
              ))
            ) : (
              <option value="" disabled>No available slots</option>
            )}
          </select>
        </div>

        {/* Save and Cancel Buttons */}
        <div className="flex justify-end">
          <button 
            className="bg-7F5539 text-white py-2 px-4 rounded mr-2" 
            onClick={handleSave}
          >
            Save
          </button>
          <button 
            className="bg-gray-300 text-black py-2 px-4 rounded" 
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
