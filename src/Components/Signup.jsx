import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    address: '',
    phoneNo: '',
    email: '',
    sex: ''
  });

  const formatName = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Format the name field specifically
    if (name === 'name') {
      setFormData({ ...formData, [name]: formatName(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      pat_name: formData.name,
      pat_dob: formData.dob,
      pat_adr: formData.address,
      pat_ph_no: formData.phoneNo,
      pat_email: formData.email,
      pat_sex: formData.sex
    };

    try {
      const response = await axios.post('http://localhost:5000/api/patients/signup', dataToSubmit);
      console.log('Patient added:', response.data);
      // Redirect to login page after successful signup
      navigate('/login/user');
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-[#B08968] text-4xl font-bold mb-8">Sign Up</h1>
      <div className="bg-[#E6CCB2] p-8 rounded-lg shadow-lg w-80">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B08968]"
              placeholder="Enter your full name"
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
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B08968]"
              placeholder="Enter your address"
              required
              onChange={handleChange}
            />
          </div>
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
            <label htmlFor="email" className="block text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B08968]"
              placeholder="Enter your email"
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="sex" className="block text-gray-700">Gender:</label>
            <select
              id="sex"
              name="sex"
              className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B08968]"
              required
              onChange={handleChange}
            >
              <option value="">Select your gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>
          <button type="submit" className="bg-[#B08968] text-white py-2 px-4 rounded w-full hover:bg-[#DDB892] transition duration-300">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login/user" className="text-[#B08968] hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
