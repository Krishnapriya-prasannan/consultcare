import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientHistory = () => {
  const [patientHistory, setPatientHistory] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [consultationModalVisible, setConsultationModalVisible] = useState(false);
  const [medicationModalVisible, setMedicationModalVisible] = useState(false);

  useEffect(() => {
    const fetchPatientHistory = async () => {
      try {
        const regNo = localStorage.getItem('regno');
        const response = await axios.get(`http://localhost:5000/api/patientHistory/${regNo}`);
        setPatientHistory(response.data);
      } catch (error) {
        console.error('Error fetching patient history:', error);
      }
    };
    fetchPatientHistory();
  }, []);

  const handleConsultationClick = (consultation) => {
    setSelectedConsultation(consultation);
    setConsultationModalVisible(true);
  };

  const handleMedicationClick = (consultationId) => {
    const relatedMedications = patientHistory.filter(entry => entry.cons_id === consultationId);
    setSelectedMedications(relatedMedications);
    setMedicationModalVisible(true);
  };

  const handleCloseConsultationModal = () => {
    setConsultationModalVisible(false);
    setSelectedConsultation(null);
  };

  const handleCloseMedicationModal = () => {
    setMedicationModalVisible(false);
    setSelectedMedications([]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-[#D4A373]">
      <h1 className="text-2xl font-bold mb-4">Patient History</h1>
      <table className="min-w-full bg-[#DDB892] rounded-lg shadow-md">
        <thead>
          <tr className="bg-[#8B5E3C] text-white">
            <th className="py-2 px-4 text-left">Date</th>
            <th className="py-2 px-4 text-left">Doctor's Name</th>
            <th className="py-2 px-4 text-center">Consultation</th>
            <th className="py-2 px-4 text-center">Medication</th>
          </tr>
        </thead>
        <tbody>
          {patientHistory.filter((entry, index, self) => 
            index === self.findIndex(e => e.cons_id === entry.cons_id)) // Ensures each consultation is listed once
            .map((entry) => (
              <tr key={entry.cons_appt_id} className="hover:bg-gray-200">
                <td className="py-2 px-4 text-left">{formatDate(entry.appt_date)}</td>
                <td className="py-2 px-4 text-left">Dr. {entry.stf_name}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    className="bg-[#8B5E3C] text-white px-2 py-1 rounded"
                    onClick={() => handleConsultationClick(entry)}
                  >
                    View Consultation
                  </button>
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    className="bg-[#8B5E3C] text-white px-2 py-1 rounded"
                    onClick={() => handleMedicationClick(entry.cons_id)}
                  >
                    View Medication
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {consultationModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded">
            <h2 className="text-lg font-bold mb-2">Consultation Details</h2>
            <div>
              <p><strong>Patient Condition:</strong> {selectedConsultation.cons_pat_condition}</p>
              <p><strong>Diagnosis:</strong> {selectedConsultation.cons_diagnosis}</p>
              <p><strong>Remarks:</strong> {selectedConsultation.cons_remarks}</p>
            </div>
            <button className="mt-4 bg-[#8B5E3C] text-white px-4 py-2 rounded" onClick={handleCloseConsultationModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {medicationModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded">
            <h2 className="text-lg font-bold mb-2">Medication Details</h2>
            {selectedMedications.map((medication, index) => (
              <div key={index} className="mb-2">
                <p><strong>Medication:</strong> {medication.med_name}</p>
                <p><strong>Dosage:</strong> {medication.med_dosage}</p>
                <p><strong>Duration:</strong> {medication.med_duration}</p>
                <p><strong>Instruction:</strong> {medication.med_instruction}</p>
                <p><strong>Remarks:</strong> {medication.med_remarks}</p>
              </div>
            ))}
            <button className="mt-4 bg-[#8B5E3C] text-white px-4 py-2 rounded" onClick={handleCloseMedicationModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientHistory;
