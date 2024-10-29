import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making API calls

const DoctorManagement = () => {
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [formValues, setFormValues] = useState({
    name: '',
    sex: 'Male',
    specialization: '',
    experience: '',
    qualification: '',
    address: '',
    email: '',
    phoneNumber: '',
    password: '',
    type: 'doctor',
    status: 'open',
    availability: {
      Monday: { enabled: false, morning: { from: '', to: '', tokens: 20 }, evening: { from: '', to: '', tokens: 16 } },
      Tuesday: { enabled: false, morning: { from: '', to: '', tokens: 20 }, evening: { from: '', to: '', tokens: 16 } },
      Wednesday: { enabled: false, morning: { from: '', to: '', tokens: 20 }, evening: { from: '', to: '', tokens: 16 } },
      Thursday: { enabled: false, morning: { from: '', to: '', tokens: 20 }, evening: { from: '', to: '', tokens: 16 } },
      Friday: { enabled: false, morning: { from: '', to: '', tokens: 20 }, evening: { from: '', to: '', tokens: 16 } },
      Saturday: { enabled: false, morning: { from: '', to: '', tokens: 20 }, evening: { from: '', to: '', tokens: 16 } }
    }
  });

  const navigate = useNavigate();

  const handleAddDoctor = () => {
    setShowAddDoctor(!showAddDoctor);
  };

  const handleEditDoctor = (doctorId) => {
    navigate('/doctorpage/profile');
  };

  const handleDeleteDoctor = (doctorId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this doctor?');
    if (confirmDelete) {
      setDoctors(doctors.filter((doctor) => doctor.id !== doctorId));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleAvailabilityChange = (day, period, field, value) => {
    setFormValues({
      ...formValues,
      availability: {
        ...formValues.availability,
        [day]: {
          ...formValues.availability[day],
          [period]: {
            ...formValues.availability[day][period],
            [field]: value
          }
        }
      }
    });
  };

  const toggleDayAvailability = (day) => {
    setFormValues({
      ...formValues,
      availability: {
        ...formValues.availability,
        [day]: { ...formValues.availability[day], enabled: !formValues.availability[day].enabled }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formValues);
    setShowAddDoctor(false);
    
    // API call to add a doctor (you'll need to define the endpoint)
    try {
      const response = await axios.post('/api/add-doctor', formValues);
      setDoctors([...doctors, response.data]);
    } catch (error) {
      console.error('Error adding doctor:', error);
    }
  };

  useEffect(() => {
    // Fetch doctors from API
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/doctors'); // Adjust the endpoint as needed
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    // Filter doctors based on search term
    const filtered = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchTerm, doctors]);

  return (
    <div className="container mx-auto p-4 bg-[#E6CCB2] rounded-md">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-6">Doctor Management</h1>

      {/* Search and Add Doctor */}
      <div className="flex justify-between items-center mb-4 space-x-2">
        <div className="flex flex-grow space-x-2">
          <input
            type="text"
            placeholder="Search Doctor by Name or Specialization"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-xs p-2 border border-gray-300 rounded-md"
          />
          <button className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded mr-2 transition duration-300 transform hover:scale-105 w-full md:w-auto">Search</button>
        </div>
        <button
          className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded mr-2 transition duration-300 transform hover:scale-105 w-full md:w-auto"
          onClick={handleAddDoctor}
        >
          {showAddDoctor ? 'Cancel' : 'Add Doctor'}
        </button>
      </div>

      {/* Add Doctor Form */}
      {showAddDoctor && (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-md mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formValues.name}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md"
              required
            />
            <select
              name="sex"
              value={formValues.sex}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              value={formValues.specialization}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="number"
              name="experience"
              placeholder="Experience (years)"
              value={formValues.experience}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              name="qualification"
              placeholder="Qualification"
              value={formValues.qualification}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formValues.address}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formValues.email}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formValues.phoneNumber}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formValues.password}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md"
              required
            />
            <select
              name="type"
              value={formValues.type}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="Doctor">Doctor</option>
              <option value="Admin">Admin</option>
            </select>
            <input
              type="text"
              name="status"
              value="Open"
              readOnly
              className="p-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"
            />
          </div>

          {/* Availability Section */}
          <h3 className="text-xl font-semibold mt-6">Availability</h3>
          <div className="mt-4">
            {Object.keys(formValues.availability).map((day) => (
              <div key={day} className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formValues.availability[day].enabled}
                    onChange={() => toggleDayAvailability(day)}
                    className="mr-2"
                  />
                  <span>{day}</span>
                </label>
                {formValues.availability[day].enabled && (
                  <div className="pl-4">
                    {/* Morning Shift */}
                    <div>
                      <p className="font-medium">Morning Shift</p>
                      <div className="flex gap-2">
                        <input
                          type="time"
                          value={formValues.availability[day].morning.from}
                          onChange={(e) => handleAvailabilityChange(day, 'morning', 'from', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="time"
                          value={formValues.availability[day].morning.to}
                          onChange={(e) => handleAvailabilityChange(day, 'morning', 'to', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="number"
                          value={formValues.availability[day].morning.tokens}
                          onChange={(e) => handleAvailabilityChange(day, 'morning', 'tokens', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md"
                          placeholder="Tokens"
                        />
                      </div>
                    </div>

                    {/* Evening Shift */}
                    <div>
                      <p className="font-medium">Evening Shift</p>
                      <div className="flex gap-2">
                        <input
                          type="time"
                          value={formValues.availability[day].evening.from}
                          onChange={(e) => handleAvailabilityChange(day, 'evening', 'from', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="time"
                          value={formValues.availability[day].evening.to}
                          onChange={(e) => handleAvailabilityChange(day, 'evening', 'to', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="number"
                          value={formValues.availability[day].evening.tokens}
                          onChange={(e) => handleAvailabilityChange(day, 'evening', 'tokens', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md"
                          placeholder="Tokens"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button type="submit" className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded mt-4 transition duration-300 transform hover:scale-105">Save Doctor</button>
        </form>
      )}

      {/* Doctor List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 border-b text-left">Name</th>
              <th className="py-2 border-b text-left">Specialization</th>
              <th className="py-2 border-b text-left">Experience</th>
              <th className="py-2 border-b text-left">Phone Number</th>
              <th className="py-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doctor) => (
              <tr key={doctor.id}>
                <td className="border-b py-2">{doctor.name}</td>
                <td className="border-b py-2">{doctor.specialization}</td>
                <td className="border-b py-2">{doctor.experience}</td>
                <td className="border-b py-2">{doctor.phoneNumber}</td>
                <td className="border-b py-2">
                  <button onClick={() => handleEditDoctor(doctor.id)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2">Edit</button>
                  <button onClick={() => handleDeleteDoctor(doctor.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorManagement;
