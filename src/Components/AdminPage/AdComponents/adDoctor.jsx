import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorManagement = () => {
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [doctors, setDoctors] = useState([]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formValues);
    setShowAddDoctor(false);
  };

  const handleSearchDoctor = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setDoctors(doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchTerm) || doctor.specialization.toLowerCase().includes(searchTerm)
    ));
  };

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
            onChange={handleSearchDoctor}
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
            />
            <input
              type="number"
              name="experience"
              placeholder="Experience"
              value={formValues.experience}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="qualification"
              placeholder="Qualification"
              value={formValues.qualification}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formValues.address}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formValues.email}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md"
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formValues.phoneNumber}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formValues.password}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md"
            />
            <select
              name="type"
              value={formValues.type}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="Doctor">D</option>
              <option value="Admin">A</option>
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
                <div className="flex justify-between items-center">
                  <label className="text-lg font-medium">{day}</label>
                  <input
                    type="checkbox"
                    checked={formValues.availability[day].enabled}
                    onChange={() => toggleDayAvailability(day)}
                  />
                </div>
                {formValues.availability[day].enabled && (
                  <div className="mt-2">
                    {/* Morning Shift */}
                    <div className="mb-2">
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
                      </div>
                    </div>
                    {/* Evening Shift */}
                    <div className="mb-2">
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
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button type="submit" className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded mt-4 transition duration-300 transform hover:scale-105">
            Submit
          </button>
        </form>
      )}

      {/* Doctor List */}
      <table className="min-w-full bg-white border border-gray-300 rounded-md">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Type</th>
            <th className="px-4 py-2 border-b">Specialization</th>
            <th className="px-4 py-2 border-b">Email</th>
            <th className="px-4 py-2 border-b">Phone Number</th>
            <th className="px-4 py-2 border-b">Qualification</th>
            <th className="px-4 py-2 border-b">Experience</th>
            <th className="px-4 py-2 border-b">Sex</th>
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.id}>
              <td className="px-4 py-2 border-b">{doctor.name}</td>
              <td className="px-4 py-2 border-b">{doctor.type}</td>
              <td className="px-4 py-2 border-b">{doctor.specialization}</td>
              <td className="px-4 py-2 border-b">{doctor.email}</td>
              <td className="px-4 py-2 border-b">{doctor.phoneNumber}</td>
              <td className="px-4 py-2 border-b">{doctor.qualification}</td>
              <td className="px-4 py-2 border-b">{doctor.experience}</td>
              <td className="px-4 py-2 border-b">{doctor.sex}</td>
              <td className="px-4 py-2 border-b">{doctor.status}</td>
              <td className="px-4 py-2 border-b flex space-x-2">
                <button onClick={() => handleEditDoctor(doctor.id)} className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105">
                  Edit
                </button>
                <button onClick={() => handleDeleteDoctor(doctor.id)} className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorManagement;
