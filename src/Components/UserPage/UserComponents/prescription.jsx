import React, { useState, useEffect } from 'react';

const Modal = ({ isOpen, onClose, medicines, appointmentId }) => {
  if (!isOpen) return null;

  console.log('Medicines in modal:', medicines); // Log the medicines array for debugging

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#E6CFC2] rounded-lg shadow-lg p-6 max-w-3xl w-full"> {/* Increased max-w to 3xl */}
        <h2 className="text-xl font-bold mb-4">Medicines for Appointment ID: {appointmentId}</h2>
        {medicines.length === 0 ? (
          <p>No medicines found for this appointment.</p>
        ) : (
          <table className="w-full mt-2 text-left border border-gray-300">
            <thead>
              <tr>
                <th className="p-2 border-b-2 border-gray-200">Medicine Name</th>
                <th className="p-2 border-b-2 border-gray-200">Dosage</th>
                <th className="p-2 border-b-2 border-gray-200">Duration</th>
                <th className="p-2 border-b-2 border-gray-200">Instructions</th>
                <th className="p-2 border-b-2 border-gray-200">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((medicine) => (
                <tr key={medicine.medicineId} className="hover:bg-[#D8A48F] transition-colors">
                  <td className="p-2 border-b border-gray-200">{medicine.medicineName}</td>
                  <td className="p-2 border-b border-gray-200">{medicine.dosage}</td>
                  <td className="p-2 border-b border-gray-200">{medicine.duration}</td>
                  <td className="p-2 border-b border-gray-200">{medicine.instructions}</td>
                  <td className="p-2 border-b border-gray-200">{medicine.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button
          onClick={onClose}
          className="bg-7F4F24 text-white py-1 px-3 rounded hover:bg-582F0E transition-all duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};


const Prescription = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const patientId = localStorage.getItem('patient_id');
  const flag = 3; // Set the appropriate flag (1 or 2) based on your requirements

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/appointments/${patientId}?flag=${flag}`);
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        console.log('Retrieved appointments:', data); // Log the appointments retrieved
        setAppointments(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patientId]);

  const fetchMedicines = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/medicines/${appointmentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch medicines');
      }
      const data = await response.json();
      console.log('Retrieved medicines:', data); // Log the medicines retrieved

      // Check if data is structured correctly
      if (Array.isArray(data)) {
        setMedicines(data); // Ensure data structure matches
      } else {
        console.error('Medicines data is not an array:', data);
        setMedicines([]); // Reset medicines if data is incorrect
      }

      setSelectedAppointmentId(appointmentId);
      setModalOpen(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const closeModal = () => {
    setMedicines([]); // Clear medicines when closing the modal
    setSelectedAppointmentId(null);
    setModalOpen(false);
  };

  return (
    <div className="p-4">
      <table className="w-full text-left bg-[#E6CFC2] rounded-lg shadow-md"> {/* Updated background color */}
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
          ) : appointments.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-4 text-center">No appointments available</td>
            </tr>
          ) : (
            appointments.map((appointment, index) => (
              <tr key={appointment.appointmentId} className="hover:bg-[#D8A48F] transition-colors">
                <td className="p-2 border-b border-gray-200">{index + 1}</td>
                <td className="p-2 border-b border-gray-200">{appointment.doctorName}</td>
                <td className="p-2 border-b border-gray-200">{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                <td className="p-2 border-b border-gray-200">
                  <button
                    onClick={() => fetchMedicines(appointment.appointmentId)}
                    className="bg-7F4F24 text-white py-1 px-3 rounded hover:bg-582F0E transition-all duration-300"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal for displaying medicines */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        medicines={medicines}
        appointmentId={selectedAppointmentId}
      />
    </div>
  );
};

export default Prescription;
