import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [patientDetails, setPatientDetails] = useState({
    regNo: '',
    name: '',
    sex: '',
    age: '',
    dob: '',
    address: '',
    email: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setErrors({});
  };

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

  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  useEffect(() => {
    // Load patient details from local storage
    const loadedDetails = {
      regNo: localStorage.getItem('patientRegNo') || '',
      name: localStorage.getItem('patientName') || '',
      sex: localStorage.getItem('patientSex') || '',
      dob: localStorage.getItem('patientDob') || '',
      address: localStorage.getItem('patientAddress') || '',
      email: localStorage.getItem('patientEmail') || '',
      phoneNumber: localStorage.getItem('patientPhoneNo') || '',
    };

    setPatientDetails(loadedDetails);
  }, []); // Empty dependency array means this effect runs once when the component mounts

  useEffect(() => {
    if (patientDetails.dob) {
      const age = calculateAge(patientDetails.dob);
      setPatientDetails((prevDetails) => ({
        ...prevDetails,
        age: age,
      }));
    }
  }, [patientDetails.dob]);

  const saveDetails = () => {
    if (validateFields()) {
      toggleEditMode();
      // Save updated details to local storage if needed
      localStorage.setItem('patientName', patientDetails.name);
      localStorage.setItem('patientSex', patientDetails.sex);
      localStorage.setItem('patientDob', patientDetails.dob);
      localStorage.setItem('patientAddress', patientDetails.address);
      localStorage.setItem('patientEmail', patientDetails.email);
      localStorage.setItem('patientPhoneNo', patientDetails.phoneNumber);
    }
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
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="mt-1 text-gray-600">{patientDetails.sex || 'N/A'}</p>
            )}
            {errors.sex && <p className="text-red-500 text-sm">{errors.sex}</p>}
          </div>

          <div className="col-span-1">
            <label className="block font-medium text-gray-700">Age:</label>
            <p className="mt-1 text-gray-600">{patientDetails.age || 'N/A'}</p>
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

        <div className="flex justify-end mt-6">
          {isEditing ? (
            <button
              onClick={saveDetails}
              className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded mr-2 transition duration-300 transition-transform transform hover:scale-105"
            >
              Save
            </button>
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

export default Profile;

