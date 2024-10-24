import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Main Admin Profile Component
const AdProfile = () => {
  const [adminDetails, setAdminDetails] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const adminId = localStorage.getItem('staff_id');

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/${adminId}`);
        setAdminDetails(response.data);
      } catch (error) {
        console.error('Error fetching admin details:', error);
        setError('Failed to load admin details');
      }
    };

    fetchAdminDetails();
  }, [adminId]);

  const handleDetailChange = async (e) => {
    e.preventDefault();
    try {
      const updatedDetails = {
        stf_name: e.target.stf_name.value,
        stf_username: e.target.stf_username.value,
        stf_sex: e.target.stf_sex.value,
        stf_speciality: e.target.stf_speciality.value,
        stf_experience: e.target.stf_experience.value,
        stf_qualification: e.target.stf_qualification.value,
        stf_email: e.target.stf_email.value,
        stf_ph_no: e.target.stf_ph_no.value,
        stf_pswd: newPassword || adminDetails.stf_pswd,
      };

      const response = await axios.put(`http://localhost:5000/api/admin/update/${adminId}`, updatedDetails);
      alert(response.data.message);
      setAdminDetails((prevDetails) => ({
        ...prevDetails,
        ...updatedDetails,
      }));
      setIsEditing(false);
      setNewPassword('');
    } catch (error) {
      console.error('Error updating admin details:', error);
      setError('Failed to update admin details');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setNewPassword(adminDetails.stf_pswd); // Set old password for editing
    } else {
      setNewPassword(''); // Clear password on cancel
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="max-w-4xl w-full bg-[#E6CCB2] shadow-md rounded-md p-6 mt-10">
        <h1 className="text-2xl font-bold mb-10 text-center text-gray-700">Admin Profile</h1>

        <form onSubmit={handleDetailChange}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <img
                src={adminDetails.stf_img_path || 'https://via.placeholder.com/150'}
                alt="Admin Profile"
                className="w-40 h-40 rounded-full shadow-md object-cover"
              />
            </div>

            {/* Admin Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {isEditing ? (
                <>
                  <InputField name="stf_name" label="Name" defaultValue={adminDetails.stf_name} />
                  <InputField name="stf_username" label="Username" defaultValue={adminDetails.stf_username} />
                  <InputField name="stf_sex" label="Sex" defaultValue={adminDetails.stf_sex} />
                  <InputField name="stf_speciality" label="Specialization" defaultValue={adminDetails.stf_speciality} />
                  <InputField name="stf_experience" label="Experience" defaultValue={adminDetails.stf_experience} />
                  <InputField name="stf_qualification" label="Qualification" defaultValue={adminDetails.stf_qualification} />
                  <InputField name="stf_email" label="Email" defaultValue={adminDetails.stf_email} type="email" />
                  <InputField name="stf_ph_no" label="Phone Number" defaultValue={adminDetails.stf_ph_no} />
                  <InputField name="stf_pswd" label="Password" value={newPassword} type="password" onChange={(e) => setNewPassword(e.target.value)} />
                </>
              ) : (
                <>
                  <DisplayField label="Name" value={adminDetails.stf_name} />
                  <DisplayField label="Username" value={adminDetails.stf_username} />
                  <DisplayField label="Sex" value={adminDetails.stf_sex} />
                  <DisplayField label="Specialization" value={adminDetails.stf_speciality} />
                  <DisplayField label="Experience" value={adminDetails.stf_experience} />
                  <DisplayField label="Qualification" value={adminDetails.stf_qualification} />
                  <DisplayField label="Email" value={adminDetails.stf_email} />
                  <DisplayField label="Phone Number" value={adminDetails.stf_ph_no} />
                  <DisplayField label="Password" value={"*****"} />
                </>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="bg-[#B08968] text-white rounded px-4 py-2"
              onClick={handleEditToggle} // Toggle edit mode
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            {isEditing && (
              <button
                type="submit"
                className="bg-[#B08968] text-white rounded px-4 py-2"
              >
                Save Changes
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// Component for displaying admin details
const DisplayField = ({ label, value }) => (
  <div className="col-span-1">
    <label className="block font-medium text-gray-700">{label}:</label>
    <p className="mt-1 text-gray-600">{value || 'N/A'}</p>
  </div>
);

// Component for input fields in edit mode
const InputField = ({ name, label, defaultValue, type = 'text', value, onChange }) => (
  <div className="col-span-1">
    <label className="block font-medium text-gray-700">{label}:</label>
    <input
      name={name}
      type={type}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      className="border rounded w-full py-2 px-3 mt-1 focus:outline-none focus:ring-2 focus:ring-[#B08968]"
      required
    />
  </div>
);

export default AdProfile;
