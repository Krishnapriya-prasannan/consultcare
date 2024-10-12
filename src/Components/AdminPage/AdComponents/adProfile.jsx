import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdProfile = () => {
  const [adminDetails, setAdminDetails] = useState({
    name: '',
    sex: '',
    address: '',
    email: '',
    phoneNumber: '',
    experience: '',
    qualification: '',
  });

  const adminId = localStorage.getItem('admin_id');
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [initialDetails, setInitialDetails] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminDetails((prevState) => ({
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
    if (!adminDetails.name) tempErrors.name = 'Name is required.';
    if (!adminDetails.sex) tempErrors.sex = 'Sex is required.';
    if (!adminDetails.address) tempErrors.address = 'Address is required.';
    if (!adminDetails.email) tempErrors.email = 'Email is required.';
    if (!adminDetails.phoneNumber) tempErrors.phoneNumber = 'Phone Number is required.';
    if (!adminDetails.experience) tempErrors.experience = 'Experience is required.';
    if (!adminDetails.qualification) tempErrors.qualification = 'Qualification is required.';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  useEffect(() => {
    // Load admin details from local storage
    const loadedDetails = {
      name: localStorage.getItem('adminName') || '',
      sex: localStorage.getItem('adminSex') || '',
      address: localStorage.getItem('adminAddress') || '',
      email: localStorage.getItem('adminEmail') || '',
      phoneNumber: localStorage.getItem('adminPhoneNo') || '',
      experience: localStorage.getItem('adminExperience') || '',
      qualification: localStorage.getItem('adminQualification') || '',
    };

    setAdminDetails(loadedDetails);
    setInitialDetails(loadedDetails);
  }, []);

  const saveDetails = async () => {
    if (validateFields()) {
      try {
        const response = await axios.put(`http://localhost:5000/api/admins/update/${adminId}`, {
          admin_name: adminDetails.name,
          admin_address: adminDetails.address,
          admin_phone_no: adminDetails.phoneNumber,
          admin_email: adminDetails.email,
          admin_sex: adminDetails.sex,
          admin_experience: adminDetails.experience,
          admin_qualification: adminDetails.qualification,
        });

        if (response.status === 200) {
          // Update local storage with new values
          Object.keys(adminDetails).forEach((key) => {
            localStorage.setItem(`admin${key.charAt(0).toUpperCase() + key.slice(1)}`, adminDetails[key]);
          });
          setInitialDetails(adminDetails);
          toggleEditMode();
        }
      } catch (error) {
        console.error('Error updating admin details:', error);
        alert('Failed to update profile. Please try again.');
      }
    }
  };

  const cancelEdit = () => {
    setAdminDetails(initialDetails);
    toggleEditMode();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="max-w-4xl w-full bg-[#E6CCB2] shadow-md rounded-md p-6 mt-10">
        <h1 className="text-2xl font-bold mb-10 text-center text-gray-700">Admin Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block font-medium text-gray-700">Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={adminDetails.name}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
              />
            ) : (
              <p className="mt-1 text-gray-600">{adminDetails.name || 'N/A'}</p>
            )}
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="col-span-1">
            <label className="block font-medium text-gray-700">Sex:</label>
            {isEditing ? (
              <select
                name="sex"
                value={adminDetails.sex}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.sex ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="mt-1 text-gray-600">{adminDetails.sex || 'N/A'}</p>
            )}
            {errors.sex && <p className="text-red-500 text-sm">{errors.sex}</p>}
          </div>

          <div className="col-span-1">
            <label className="block font-medium text-gray-700">Address:</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={adminDetails.address}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
              />
            ) : (
              <p className="mt-1 text-gray-600">{adminDetails.address || 'N/A'}</p>
            )}
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          <div className="col-span-1">
            <label className="block font-medium text-gray-700">Email:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={adminDetails.email}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
              />
            ) : (
              <p className="mt-1 text-gray-600">{adminDetails.email || 'N/A'}</p>
            )}
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="col-span-1">
            <label className="block font-medium text-gray-700">Phone Number:</label>
            {isEditing ? (
              <input
                type="text"
                name="phoneNumber"
                value={adminDetails.phoneNumber}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
              />
            ) : (
              <p className="mt-1 text-gray-600">{adminDetails.phoneNumber || 'N/A'}</p>
            )}
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
          </div>

          <div className="col-span-1">
            <label className="block font-medium text-gray-700">Experience:</label>
            {isEditing ? (
              <input
                type="text"
                name="experience"
                value={adminDetails.experience}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.experience ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
              />
            ) : (
              <p className="mt-1 text-gray-600">{adminDetails.experience || 'N/A'}</p>
            )}
            {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
          </div>

          <div className="col-span-1">
            <label className="block font-medium text-gray-700">Qualification:</label>
            {isEditing ? (
              <input
                type="text"
                name="qualification"
                value={adminDetails.qualification}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.qualification ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
              />
            ) : (
              <p className="mt-1 text-gray-600">{adminDetails.qualification || 'N/A'}</p>
            )}
            {errors.qualification && <p className="text-red-500 text-sm">{errors.qualification}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={saveDetails}
                className="px-4 py-2 bg-[#CB997E] text-white rounded-md"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="px-4 py-2 bg-[#CB997E] text-white rounded-md"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={toggleEditMode}
              className="px-4 py-2 bg-[#CB997E] text-white rounded-md"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdProfile;
