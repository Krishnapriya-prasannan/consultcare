import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorManagement = () => {
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [doctors, setDoctors] = useState([]);

  const [formValues, setFormValues] = useState({
    name: '',
    sex: '',
    specialization: '',
    experience: '',
    qualification: '',
    address: '',
    email: '',
    phoneNumber: '',
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
    // Add form submission logic here
    console.log('Form Submitted:', formValues);
    // Example: setDoctors([...doctors, { id: newId, ...formValues }]);
    setShowAddDoctor(false); // Hide the form after submission
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
            placeholder="Search Doctor by Patient ID"
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
            <input
              type="text"
              name="sex"
              placeholder="Sex"
              value={formValues.sex}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md"
            />
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

          <button type="submit" className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded mr-2 transition duration-300 transform hover:scale-105 w-full md:w-auto">
            Save Doctor
          </button>
        </form>
      )}

      {/* Doctor List */}
      <div className="bg-white p-4 rounded-md">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Doctor Name</th>
              <th className="p-2">Specialization</th>
              <th className="p-2">Experience</th>
              <th className="p-2">Qualification</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="border-t">
                <td className="p-2">{doctor.name}</td>
                <td className="p-2">{doctor.specialization}</td>
                <td className="p-2">{doctor.experience}</td>
                <td className="p-2">{doctor.qualification}</td>
                <td className="p-2 space-x-2">
                  <button
                    className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded mr-2 transition duration-300 transform hover:scale-105 w-full md:w-auto"
                    onClick={() => handleEditDoctor(doctor.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-[#9C6644] hover:bg-[#582F0E] text-white font-bold py-2 px-4 rounded mr-2 transition duration-300 transform hover:scale-105 w-full md:w-auto"
                    onClick={() => handleDeleteDoctor(doctor.id)}
                  >
                    Delete
                  </button>
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
