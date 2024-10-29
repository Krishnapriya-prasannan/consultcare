import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isUser = location.pathname.includes('user');

  const [formData, setFormData] = useState({
    phoneNo: '',
    dob: '',
    staffUsername: '', // Changed from staffId to staffUsername
    staffPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = isUser
        ? { phoneNo: formData.phoneNo, dob: formData.dob }
        : { staffUsername: formData.staffUsername, staffPassword: formData.staffPassword };

    try {
        const endpoint = isUser
            ? 'http://localhost:5000/api/login/patient'
            : 'http://localhost:5000/api/login/staff';

        const response = await axios.post(endpoint, payload);

        if (isUser) {
            const { patient_id } = response.data;
            localStorage.setItem('patient_id', patient_id);
            navigate('/UserPage');
        } else {
            const { staffId, staffType,staffName, message } = response.data;

            if (staffId !== undefined) {
                localStorage.setItem('staff_id', staffId); // Store staffId in local storage
                localStorage.setItem('staff_name',staffName);
                console.log('Stored staff ID:', staffName); // Log the staff ID to check its value
                localStorage.setItem('staff_type', staffType);
                navigate(staffType === 'A' ? '/adminpage' : '/doctorpage');
            } else {
                setError('Staff ID is undefined. Please check your login credentials.');
            }
        }
    } catch (error) {
        console.error('Error logging in:', error);
        const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
        setError(errorMessage);
    }
};


  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-[#B08968] text-4xl font-bold mb-8">Login</h1>
      <div className="bg-[#E6CCB2] p-8 rounded-lg shadow-lg w-80">
        <form onSubmit={handleSubmit}>
          {isUser ? (
            <>
              <div className="mb-4">
                <label htmlFor="phoneNo" className="block text-gray-700">Phone Number:</label>
                <input
                  type="tel"
                  id="phoneNo"
                  name="phoneNo"
                  className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B08968]"
                  placeholder="Enter your phone number"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="dob" className="block text-gray-700">Date of Birth:</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B08968]"
                  required
                  onChange={handleChange}
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label htmlFor="staffUsername" className="block text-gray-700">Username:</label> {/* Changed from ID to Username */}
                <input
                  type="text"
                  id="staffUsername"
                  name="staffUsername" // Changed from staffId to staffUsername
                  className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B08968]"
                  placeholder="Enter your username"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="staffPassword" className="block text-gray-700">Password:</label>
                <input
                  type="password"
                  id="staffPassword"
                  name="staffPassword"
                  className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B08968]"
                  placeholder="Enter your password"
                  required
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          <button type="submit" className="bg-[#B08968] text-white py-2 px-4 rounded w-full hover:bg-[#DDB892] transition duration-300">
            Login
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>} {/* Display error message */}
        {isUser && (
          <p className="mt-4 text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#B08968] hover:underline">
              Sign up here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
