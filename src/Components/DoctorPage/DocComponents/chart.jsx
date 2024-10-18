import React, { useState } from 'react';

const DoctorView = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [medications, setMedications] = useState([{ name: '', dosage: '', duration: '', instruction: '', remarks: '' }]);
  const [consultationModalVisible, setConsultationModalVisible] = useState(false);
  const [medicationModalVisible, setMedicationModalVisible] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Sample previous appointment data
  const previousAppointments = [
    {
      date: '2023-09-01',
      doctor: 'Dr. Smith',
      consultations: ['Checkup', 'Blood Test'],
      medications: [{ name: 'Medication A', dosage: '500mg', duration: '5 days', instruction: 'Take once a day', remarks: 'After meals' }],
      patientCondition: 'Mild Fever bdsidhwqid,dbwuydgaufgaifkqw,beiud geudd hyfufhweffb bhdbefbweu bejheu bjgduwh nduikehd   dgeuqgeueb',
      diagnosis: 'Viral  vvdsjb  kjdfjkaba ckdabj jdhu jdbajd jdhgaid gcdfdhfvIn n m gjbkjohcv sfkshfiufbafa kasfbafbasjfgauif fguegfagdagadgasdgasdsajdg  feyfgydgwygwiwwiegfection',
      remarks: 'Follow ncdbcsknccj cbdhjak cakahf akagak  casvvdsbdh   bahfgajfba  up after a week',
    },
    {
      date: '2023-10-05',
      doctor: 'Dr. Jones',
      consultations: ['Fever Follow-up'],
      medications: [
        { name: 'Medication B', dosage: '250mg', duration: '3 days', instruction: 'Take twice a day', remarks: 'Before meals' },
        { name: 'Medication C', dosage: '200mg', duration: '7 days', instruction: 'Take thrice a day', remarks: 'With water' },
      ],
      patientCondition: 'Severe Cough',
      diagnosis: 'Chest Infection',
      remarks: 'Prescribe inhaler',
    },
    {
      date: '2023-11-10',
      doctor: 'Dr. Lee',
      consultations: ['Regular Visit'],
      medications: [],
      patientCondition: 'Routine Check',
      diagnosis: 'No issues found',
      remarks: 'Healthy',
    },
  ];

  const handleDateClick = (date) => {
    setSelectedDate(date);
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

  const handleCloseConsultationModal = () => {
    setConsultationModalVisible(false);
  };

  const handleCloseMedicationModal = () => {
    setMedicationModalVisible(false);
  };

  const handleSave = () => {
    setSaveMessage('Data successfully saved!');
    setTimeout(() => setSaveMessage(''), 3000); 
  };

  return (
    <div className="flex h-screen">
      {/* Side Navbar */}
      <nav className="w-1/4 bg-[#DDB892] p-4 h-full">
        <h2 className="text-lg font-bold mb-4 text-[#5C4033]">Patient History</h2>
        
        <div className="mt-2 mb-4">
          <button
            className="bg-[#8B5E3C] text-white px-2 py-1 rounded mr-2"
            onClick={() => setConsultationModalVisible(true)}
          >
            Consultation
          </button>
          <button
            className="bg-[#8B5E3C] text-white px-2 py-1 rounded"
            onClick={() => setMedicationModalVisible(true)}
          >
            Medication
          </button>
        </div>
        
        <ul>
          {previousAppointments.map((appointment, index) => (
            <li
              key={index}
              className={`p-2 cursor-pointer ${selectedDate === appointment.date ? 'bg-[#8B5E3C] text-white' : 'text-[#5C4033]'}`}
              onClick={() => handleDateClick(appointment.date)}
            >
              {formatDate(appointment.date)} - {appointment.doctor}
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <div className="w-3/4 p-6 bg-[#D4A373] overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4 text-[#5C4033]">Doctor's Consultation & Medication</h1>

        {/* Consultation Form */}
        <div className="flex">
          <div className="w-1/2 pr-4">
            <h2 className="text-lg font-bold mb-2">Consultation Form</h2>
            <div>
              <label className="block mb-1">Patient Reg No:</label>
              <input type="text" className="w-full p-2 rounded" defaultValue="12345" />
            </div>
            <div className="mt-2">
              <label className="block mb-1">Date:</label>
              <input type="text" className="w-full p-2 rounded" defaultValue={formatDate(new Date())} readOnly />
            </div>
            <div className="mt-2">
              <label className="block mb-1">Doctor's Name:</label>
              <input type="text" className="w-full p-2 rounded" defaultValue="Dr. Smith" />
            </div>
            <div className="mt-2">
              <label className="block mb-1">Patient Condition:</label>
              <textarea className="w-full p-2 rounded" rows="4"></textarea>
            </div>
            <div className="mt-2">
              <label className="block mb-1">Diagnosis:</label>
              <textarea className="w-full p-2 rounded" rows="4"></textarea>
            </div>
            <div className="mt-2">
              <label className="block mb-1">Remarks:</label>
              <textarea className="w-full p-2 rounded" rows="4"></textarea>
            </div>
          </div>

          {/* Medication Form */}
          <div className="w-1/2 pl-4">
            <h2 className="text-lg font-bold mb-2">Medication Form</h2>
            {medications.map((medication, index) => (
              <div key={index} className="mb-4">
                <div className="mt-2">
                  <label className="block mb-1">Medication Name:</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded"
                    value={medication.name}
                    onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <label className="block mb-1">Dosage:</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded"
                    value={medication.dosage}
                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <label className="block mb-1">Duration:</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded"
                    value={medication.duration}
                    onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <label className="block mb-1">Instruction:</label>
                  <textarea
                    className="w-full p-2 rounded"
                    rows="2"
                    value={medication.instruction}
                    onChange={(e) => handleMedicationChange(index, 'instruction', e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <label className="block mb-1">Remarks:</label>
                  <textarea
                    className="w-full p-2 rounded"
                    rows="2"
                    value={medication.remarks}
                    onChange={(e) => handleMedicationChange(index, 'remarks', e.target.value)}
                  />
                </div>
                <hr className="my-4 border-b-2 border-[#8B5E3C]" />
              </div>
            ))}
            <button
              className="bg-[#8B5E3C] text-white px-4 py-2 rounded mt-4"
              onClick={addMedication}
            >
              Add Medication
            </button>
          </div>
        </div>

        <button className="mt-4 bg-[#8B5E3C] text-white px-4 py-2 rounded" onClick={handleSave}>
          Save
        </button>
        <p className="mt-2 text-brown-600">{saveMessage}</p>

        {/* Modal for Consultation Details */}
{consultationModalVisible && selectedDate && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full overflow-y-auto" style={{ maxHeight: '60vh' }}>
      <h2 className="text-lg font-bold mb-2">Consultation Details</h2>
      <div className="overflow-y-auto" style={{ maxHeight: '50vh' }}>
        <h3 className="font-bold">Doctor:</h3>
        <p>{previousAppointments.find(app => app.date === selectedDate)?.doctor}</p>
        <h3 className="font-bold">Patient Condition:</h3>
        <p>{previousAppointments.find(app => app.date === selectedDate)?.patientCondition}</p>
        <h3 className="font-bold">Diagnosis:</h3>
        <p>{previousAppointments.find(app => app.date === selectedDate)?.diagnosis}</p>
        <h3 className="font-bold">Remarks:</h3>
        <p>{previousAppointments.find(app => app.date === selectedDate)?.remarks}</p>
      </div>
      <button className="mt-4 bg-[#8B5E3C] text-white px-4 py-2 rounded" onClick={handleCloseConsultationModal}>
        Close
      </button>
    </div>
  </div>
)}


        {/* Modal for Medication Details */}
        {medicationModalVisible && selectedDate && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full overflow-y-auto" style={{ maxHeight: '60vh' }}>
              <h2 className="text-lg font-bold mb-2">Medication Details</h2>
              <ul>
                {previousAppointments.find(app => app.date === selectedDate)?.medications.map((medication, index) => (
                  <li key={index} className="mb-4">
                    <h3 className="font-bold">Medication Name:</h3>
                    <p>{medication.name}</p>
                    <h3 className="font-bold">Dosage:</h3>
                    <p>{medication.dosage}</p>
                    <h3 className="font-bold">Duration:</h3>
                    <p>{medication.duration}</p>
                    <h3 className="font-bold">Instruction:</h3>
                    <p>{medication.instruction}</p>
                    <h3 className="font-bold">Remarks:</h3>
                    <p>{medication.remarks}</p>
                    <hr className="my-4 border-b-2 border-[#8B5E3C]" />
                  </li>
                ))}
              </ul>
              <button className="mt-4 bg-[#8B5E3C] text-white px-4 py-2 rounded" onClick={handleCloseMedicationModal}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorView;
