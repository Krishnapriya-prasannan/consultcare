import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DocProfile = () => {
  const [doctorDetails, setDoctorDetails] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode
  const doctorId = localStorage.getItem('staff_id'); // Get doctor ID from local storage

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/doctor/${doctorId}`);
        setDoctorDetails(response.data);
      } catch (error) {
        console.error('Error fetching doctor details:', error);
        setError('Failed to load doctor details');
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/doctor/update-password', {
        doctorId,
        newPassword,
      });
      alert(response.data.message);
      setNewPassword(''); // Clear the password input
      setIsEditing(false); // Exit edit mode after updating
    } catch (error) {
      console.error('Error updating password:', error);
      setError('Failed to update password');
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="max-w-4xl w-full bg-[#E6CCB2] shadow-md rounded-md p-6 mt-10">
        <h1 className="text-2xl font-bold mb-10 text-center text-gray-700">Doctor Profile</h1>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
          <img
  src={doctorDetails.stf_img_path || 'https://example.com/path-to-google-image.jpg'}
  alt="Doctor Profile"
  className="w-40 h-40 rounded-full shadow-md object-cover"
  style={{ objectPosition: 'top' }} // Adjusts the position to focus on the top of the image
/>

          </div>

          {/* Doctor Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="col-span-1">
              <label className="block font-medium text-gray-700">Name:</label>
              <p className="mt-1 text-gray-600">{doctorDetails.stf_name || 'N/A'}</p>
            </div>
            <div className="col-span-1">
              <label className="block font-medium text-gray-700">Username:</label>
              <p className="mt-1 text-gray-600">{doctorDetails.stf_username || 'N/A'}</p>
            </div>
            <div className="col-span-1">
              <label className="block font-medium text-gray-700">Sex:</label>
              <p className="mt-1 text-gray-600">{doctorDetails.stf_sex || 'N/A'}</p>
            </div>
            <div className="col-span-1">
              <label className="block font-medium text-gray-700">Specialization:</label>
              <p className="mt-1 text-gray-600">{doctorDetails.stf_speciality || 'N/A'}</p>
            </div>
            <div className="col-span-1">
              <label className="block font-medium text-gray-700">Experience:</label>
              <p className="mt-1 text-gray-600">{doctorDetails.stf_experience || 'N/A'}</p>
            </div>
            <div className="col-span-1">
              <label className="block font-medium text-gray-700">Qualification:</label>
              <p className="mt-1 text-gray-600">{doctorDetails.stf_qualification || 'N/A'}</p>
            </div>
            <div className="col-span-1">
              <label className="block font-medium text-gray-700">Email:</label>
              <p className="mt-1 text-gray-600">{doctorDetails.stf_email || 'N/A'}</p>
            </div>
            <div className="col-span-1">
              <label className="block font-medium text-gray-700">Phone Number:</label>
              <p className="mt-1 text-gray-600">{doctorDetails.stf_ph_no || 'N/A'}</p>
            </div>
            <div className="col-span-1">
              <label className="block font-medium text-gray-700">Password:</label>
              {isEditing ? (
                <form onSubmit={handlePasswordChange}>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border rounded w-full py-2 px-3 mt-1 focus:outline-none focus:ring-2 focus:ring-[#B08968]"
                    placeholder="Enter new password"
                    required
                  />
                  {error && <p className="text-red-500">{error}</p>}
                </form>
              ) : (
                <div className="mt-1 text-gray-600">*******</div> // Masked password display
              )}
            </div>
          </div>
        </div>

        {/* Edit and Cancel Buttons positioned at the bottom right */}
        <div className="flex justify-end mt-4">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)} // Cancel editing
                className="bg-[#B08968] text-white py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handlePasswordChange}
                className="bg-[#B08968] text-white py-2 px-4 rounded"
              >
                Update Password
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)} // Enable editing
              className="bg-[#B08968] text-white py-2 px-4 rounded"
            >
              Edit Password
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocProfile;
