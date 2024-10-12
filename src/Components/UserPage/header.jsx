import React, { useEffect, useState } from 'react';
import { FaUserMd } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';

const Header = () => {
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    regno: '',
    dob: '',
    address: '',
    phone_no: '',
    email: '',
    sex: '',
  });

  useEffect(() => {
    // Get the patient ID from local storage
    const patientId = localStorage.getItem('patient_id');

    // Function to fetch patient details and store in local storage
    const fetchPatientDetails = async () => {
      if (patientId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/Retrievepatient/${patientId}`);
          
          // Destructure the data from the response
          const { name, regno, dob, address, phone_no, email, sex, status } = response.data;

          console.log('API Response:', response.data);
          console.log('patient_id:', patientId);

          // Store each field individually in localStorage
          localStorage.setItem('patientName', name);
          localStorage.setItem('patientRegNo', regno);
          localStorage.setItem('patientDob', dob);
          localStorage.setItem('patientAddress', address);
          localStorage.setItem('patientPhoneNo', phone_no);
          localStorage.setItem('patientEmail', email);
          localStorage.setItem('patientSex', sex);
          localStorage.setItem('patientstatus', status);

          console.log('Stored name:', localStorage.getItem('patientName'));
          console.log('Stored regno:', localStorage.getItem('patientRegNo'));
          console.log('Stored status:', localStorage.getItem('patientstatus'));


          // Update the state with the patient details
          setPatientDetails({ name, regno, dob, address, phone_no, email, sex, status });

        } catch (error) {
          console.error('Error fetching patient details:', error);
        }
      }
    };

    fetchPatientDetails();
  }, []);

  const { name, regno, } = patientDetails;

  return (
    <header className="bg-[#E6CCB2] text-[#3B2F2F] p-12 flex flex-row items-center justify-between relative">
      {/* ConsultCare Logo and Patient Information */}
      <div className="flex items-center space-x-5">
        <FaUserMd className="w-16 h-20 text-[#582F0E]" />
        <span className="text-lg font-bold">ConsultCare</span>
        <div className="flex items-center space-x-5">
          <FaUser className="w-16 h-20 text-[#7F4F24]" />
          <div className="flex flex-col items-start">
            <p className="text-lg-sm font-bold">Welcome</p>
            <p className="text-sm font-bold">Name: {name}</p>
            <p className="text-sm font-bold">Reg No: {regno}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
