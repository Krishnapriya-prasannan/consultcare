import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [patientRegNo, setPatientRegNo] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [medications, setMedications] = useState([{ name: '', dosage: '', duration: '', instruction: '', remarks: '' }]);
  const [consultationModalVisible, setConsultationModalVisible] = useState(false);
  const [medicationModalVisible, setMedicationModalVisible] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [patientHistory, setPatientHistory] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [viewMode, setViewMode] = useState('consultation');
  const [patientId, setPatientId] = useState('');
  const [patientCondition, setPatientCondition] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null); 

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const patient_reg_no = localStorage.getItem('regno');
        const staffId = localStorage.getItem('staff_id');
        const apptTokNo = localStorage.getItem('tokNo');
        console.log('TOKEN ',apptTokNo);
        const doctorResponse = await axios.get(`http://localhost:5000/api/doctor/${staffId}`);
        setDoctorName(doctorResponse.data.stf_name);
        setPatientRegNo(patient_reg_no);
        
        const patientResponse = await axios.get(`http://localhost:5000/api/patientsId/${patient_reg_no}`);
        const patientId = patientResponse.data.patientId; 
        setPatientId(patientId);
        const appointmentsResponse = await axios.get(`http://localhost:5000/api/appointments/${patientId}`);
        setPreviousAppointments(appointmentsResponse.data.previousAppointments);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDoctorData();
  }, []);

  useEffect(() => {
    const fetchPatientHistory = async () => {
      try {
        const regNo = localStorage.getItem('regno');
        setPatientRegNo(regNo);
  
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
  
  const handleDateClick = (appointment) => {
    setSelectedAppointment(appointment);
    setSelectedDate(new Date(appointment.date));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', duration: '', instruction: '', remarks: '' }]);
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...medications];
    updatedMedications[index][field] = value;
    setMedications(updatedMedications);
  };

  const handleSave = async () => {
    try {
      const appointmentDate = new Date(selectedDate).toISOString().slice(0, 10);
      const doctorId = localStorage.getItem('staff_id');
      const apptTokNo = localStorage.getItem('tokNo');
      console.log('TOKEN ',apptTokNo);
      const saveData = {
        patientRegNo,
        doctorId,
        appointmentDate,
        apptTokNo,
        patientCondition,
        diagnosis,
        remarks,
        medicationEntries: medications,
      };

      await axios.post('http://localhost:5000/api/addNewChart', saveData);
      setSaveMessage('Data successfully saved!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving data:', error.response ? error.response.data : error.message);
      setSaveMessage('Error saving data. Please try again.');
    }
  };

  const toggleModal = (type) => {
    if (type === 'consultation') {
      setConsultationModalVisible(!consultationModalVisible);
    } else {
      setMedicationModalVisible(!medicationModalVisible);
    }
  };

  return (
    <div className="flex h-screen">
      <nav className="w-1/4 bg-[#DDB892] p-4 h-full">
        <div className="mt-2 mb-4">
          <button
            className={`bg-[#8B5E3C] text-white px-2 py-1 rounded mr-2 ${viewMode === 'consultation' ? 'bg-opacity-70' : ''}`}
            onClick={() => setViewMode('consultation')}
          >
            Consultation
          </button>
          <button
            className={`bg-[#8B5E3C] text-white px-2 py-1 rounded ${viewMode === 'medication' ? 'bg-opacity-70' : ''}`}
            onClick={() => setViewMode('medication')}
          >
            Medication
          </button>
        </div>

        <ul>
  {patientHistory
    .filter((entry, index, self) => 
      index === self.findIndex(e => e.cons_id === entry.cons_id)) // Ensures each consultation is listed once
    .map((entry) => (
      <li
        key={entry.cons_appt_id}
        className={`p-2 cursor-pointer ${viewMode === 'consultation' ? 'text-[#5C4033]' : 'text-[#5C4033]'}`}
        onClick={() => {
          if (viewMode === 'consultation') {
            handleConsultationClick(entry);
          } else {
            handleMedicationClick(entry.cons_id);
          }
        }}
      >
        {formatDate(entry.appt_date)} - Dr. {entry.stf_name}
      </li>
    ))}
</ul>

      </nav>

      <div className="w-3/4 p-6 bg-[#D4A373] overflow-y-auto">
        {viewMode === 'consultation' && selectedConsultation && (
          <div>
            {patientHistory.filter(entry => entry.cons_id === selectedConsultation.cons_id).map((entry) => (
              <div key={entry.cons_id}>
                <p><strong>Condition:</strong> {entry.cons_pat_condition}</p>
                <p><strong>Diagnosis:</strong> {entry.cons_diagnosis}</p>
                <p><strong>Remarks:</strong> {entry.cons_remarks}</p>
              </div>
            ))}
          </div>
        )}
        {/* No longer displaying medications in the main form */}
        
        <div className="flex">
          {/* Consultation Form */}
          <div className="w-1/2 pr-4">
            <h2 className="text-lg font-bold mb-2">Consultation Form</h2>
            <div>
              <label className="block mb-1">Patient Reg No:</label>
              <input type="text" className="w-full p-2 rounded" value={patientRegNo} readOnly />
            </div>
            <div className="mt-2">
              <label className="block mb-1">Date:</label>
              <input type="text" className="w-full p-2 rounded" value={formatDate(new Date())} readOnly />
            </div>
            <div className="mt-2">
              <label className="block mb-1">Doctor's Name:</label>
              <input type="text" className="w-full p-2 rounded" value={doctorName} readOnly />
            </div>
            <div className="mt-2">
              <label className="block mb-1">Patient Condition:</label>
              <textarea
                className="w-full p-2 rounded"
                value={patientCondition}
                onChange={(e) => setPatientCondition(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <label className="block mb-1">Diagnosis:</label>
              <textarea
                className="w-full p-2 rounded"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <label className="block mb-1">Remarks:</label>
              <textarea
                className="w-full p-2 rounded"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
            <button className="mt-4 bg-[#8B5E3C] text-white px-4 py-2 rounded" onClick={handleSave}>
              Save Consultation
            </button>
            {saveMessage && <p className="text-green-500">{saveMessage}</p>}
          </div>
          
          {/* Medications */}
          <div className="w-1/2 pl-4">
            <h2 className="text-lg font-bold mb-2">Medications</h2>
            {medications.map((medication, index) => (
              <div key={index} className="mb-2 border p-2 rounded">
                <div>
                  <label className="block mb-1">Name:</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded"
                    value={medication.name}
                    onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-1">Dosage:</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded"
                    value={medication.dosage}
                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-1">Duration:</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded"
                    value={medication.duration}
                    onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-1">Instruction:</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded"
                    value={medication.instruction}
                    onChange={(e) => handleMedicationChange(index, 'instruction', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-1">Remarks:</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded"
                    value={medication.remarks}
                    onChange={(e) => handleMedicationChange(index, 'remarks', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button className="mt-4 bg-[#8B5E3C] text-white px-4 py-2 rounded" onClick={addMedication}>
              Add Medication
            </button>
          </div>
        </div>
      </div>

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

export default DoctorView;
