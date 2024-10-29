import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientProfile = () => {
  const [patientDetails, setPatientDetails] = useState({
    regNo: '',
    name: '',
    sex: '',
    age: '',
    dob: '',
    address: '',
    email: '',
    phoneNumber: '',
    status: ''
  });

  const patientId = localStorage.getItem('patient_id'); // Assuming patient ID is still stored in local storage
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [initialDetails, setInitialDetails] = useState({});

  // Calculate age based on DOB
  const AgeCalculation = (dob) => {
    if (!dob) return 'N/A'; // If DOB is not available, return 'N/A'
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970); // Get full years of difference
  };

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Fetch patient details from the API
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/Retrievepatient/${patientId}`);
        if (response.status === 200) {
          const patientData = response.data;
          setPatientDetails({
            regNo: patientData.regno,
            name: patientData.name,
            sex: patientData.sex,
            dob: patientData.dob,
            address: patientData.address,
            email: patientData.email,
            phoneNumber: patientData.phone_no,
            status: patientData.status,
            age: AgeCalculation(patientData.dob) // Calculate age when patient data is fetched
          });
          setInitialDetails(patientData);
        }
      } catch (error) {
        console.error('Error fetching patient details:', error);
      }
    };

    fetchPatientDetails();
  }, [patientId]);

  // Handle age recalculation when DOB changes during editing
  useEffect(() => {
    if (patientDetails.dob) {
      const age = AgeCalculation(patientDetails.dob);
      setPatientDetails((prevDetails) => ({
        ...prevDetails,
        age: age || 'N/A',
      }));
    }
  }, [patientDetails.dob]);

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setErrors({});
  };

  // Validate fields before saving
  const validateFields = () => {
    let tempErrors = {};
    if (!patientDetails.name) tempErrors.name = 'Name is required.';
    if (!patientDetails.sex) tempErrors.sex = 'Sex is required.';
    if (!patientDetails.dob) tempErrors.dob = 'DOB is required.';
    if (!patientDetails.address) tempErrors.address = 'Address is required.';
    if (!patientDetails.email) tempErrors.email = 'Email is required.';
    if (!patientDetails.phoneNumber) tempErrors.phoneNumber = 'Phone Number is required.';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Save updated details
  const saveDetails = async () => {
    if (validateFields()) {
      try {
        const { name, dob, address, phoneNumber, email, sex, regNo } = patientDetails;
        const response = await axios.put(`http://localhost:5000/api/patients/update/${patientId}`, {
          pat_name: name,
          pat_dob: dob,
          pat_adr: address,
          pat_ph_no: phoneNumber,
          pat_email: email,
          pat_sex: sex,
          pat_reg_no: regNo,
        });

        if (response.status === 200) {
          setInitialDetails(patientDetails);
          toggleEditMode();
        }
      } catch (error) {
        console.error('Error updating patient details:', error);
        alert('Failed to update profile. Please try again.');
      }
    }
  };

  // Cancel edit and revert to initial details
  const cancelEdit = () => {
    setPatientDetails(initialDetails);
    toggleEditMode();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="max-w-4xl w-full bg-[#E6CCB2] shadow-md rounded-md p-6 mt-10">
        <h1 className="text-2xl font-bold mb-10 text-center text-gray-700">Patient Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block font-medium text-gray-700">Reg No:</label>
            <p className="mt-1 text-gray-600">{patientDetails.regNo || 'N/A'}</p>
          </div>

          <div className="col-span-1">
            <label className="block font-medium text-gray-700">Status:</label>
            <p className="mt-1 text-gray-600">{patientDetails.status || 'N/A'}</p>
          </div>

          <div className="col-span-1">
            <label className="block font-medium text-gray-700">Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={patientDetails.name}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
              />
            ) : (
              <p className="mt-1 text-gray-600">{patientDetails.name || 'N/A'}</p>
            )}
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="col-span-1">
            <label className="block font-medium text-gray-700">DOB:</label>
            {isEditing ? (
              <input
                type="date"
                name="dob"
                value={patientDetails.dob}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.dob ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
              />
            ) : (
              <p className="mt-1 text-gray-600">{patientDetails.dob || 'N/A'}</p>
            )}
            {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
          </div>

          <div className="col-span-1">
            <label className="block font-medium text-gray-700">Sex:</label>
            {isEditing ? (
              <select
                name="sex"
                value={patientDetails.sex}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.sex ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
              >
                <option value="">Select</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Others</option>
              </select>
            ) : (
              <p className="mt-1 text-gray-600">{patientDetails.sex || 'N/A'}</p>
            )}
            {errors.sex && <p className="text-red-500 text-sm">{errors.sex}</p>}
          </div>

          <div className="col-span-1">
            <label className="block font-medium text-gray-700">Age:</label>
            <p className="mt-1 text-gray-600">{patientDetails.age !== '' ? patientDetails.age : 'N/A'}</p>
          </div>

          <div className="col-span-1">
            <label className="block font-medium text-gray-700">Address:</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={patientDetails.address}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
              />
            ) : (
              <p className="mt-1 text-gray-600">{patientDetails.address || 'N/A'}</p>
            )}
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          <div className="col-span-1">
            <label className="block font-medium text-gray-700">Email:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={patientDetails.email}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
              />
            ) : (
              <p className="mt-1 text-gray-600">{patientDetails.email || 'N/A'}</p>
            )}
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="col-span-1">
            <label className="block font-medium text-gray-700">Phone Number:</label>
            {isEditing ? (
              <input
                type="text"
                name="phoneNumber"
                value={patientDetails.phoneNumber}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
              />
            ) : (
              <p className="mt-1 text-gray-600">{patientDetails.phoneNumber || 'N/A'}</p>
            )}
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={saveDetails}
                className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded transition duration-300 transition-transform transform hover:scale-105"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded transition duration-300 transition-transform transform hover:scale-105"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={toggleEditMode}
              className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded transition duration-300 transition-transform transform hover:scale-105"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
