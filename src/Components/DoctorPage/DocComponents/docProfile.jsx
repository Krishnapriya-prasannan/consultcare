import React from 'react';

const DocProfile = ({ doctorDetails }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="max-w-4xl w-full bg-[#E6CCB2] shadow-md rounded-md p-6 mt-10">
        <h1 className="text-2xl font-bold mb-10 text-center text-gray-700">Doctor Profile</h1>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <img
              src={doctorDetails?.profilePic || 'https://via.placeholder.com/150'}
              alt="Doctor Profile"
              className="w-40 h-40 rounded-full shadow-md object-cover"
            />
          </div>

          {/* Doctor Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="col-span-1">
              <label className="block font-medium text-gray-700">Name:</label>
              <p className="mt-1 text-gray-600">{doctorDetails?.name || 'N/A'}</p>
            </div>

            <div className="col-span-1">
              <label className="block font-medium text-gray-700">Sex:</label>
              <p className="mt-1 text-gray-600">{doctorDetails?.sex || 'N/A'}</p>
            </div>

            <div className="col-span-1">
              <label className="block font-medium text-gray-700">Specialization:</label>
              <p className="mt-1 text-gray-600">{doctorDetails?.specialization || 'N/A'}</p>
            </div>

            <div className="col-span-1">
              <label className="block font-medium text-gray-700">Experience:</label>
              <p className="mt-1 text-gray-600">{doctorDetails?.experience || 'N/A'}</p>
            </div>

            <div className="col-span-1">
              <label className="block font-medium text-gray-700">Qualification:</label>
              <p className="mt-1 text-gray-600">{doctorDetails?.qualification || 'N/A'}</p>
            </div>

            <div className="col-span-1">
              <label className="block font-medium text-gray-700">Address:</label>
              <p className="mt-1 text-gray-600">{doctorDetails?.address || 'N/A'}</p>
            </div>

            <div className="col-span-1">
              <label className="block font-medium text-gray-700">Email:</label>
              <p className="mt-1 text-gray-600">{doctorDetails?.email || 'N/A'}</p>
            </div>

            <div className="col-span-1">
              <label className="block font-medium text-gray-700">Phone Number:</label>
              <p className="mt-1 text-gray-600">{doctorDetails?.phoneNumber || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocProfile;
