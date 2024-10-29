import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WhoAmI from './Components/who';
import Login from './Components/Login';
import Signup from './Components/Signup';
import UserPage from './Components/userStruct';
import Profile from './Components/UserPage/UserComponents/profile';
import Appointment from './Components/UserPage/UserComponents/appointment';
import Prescription from './Components/UserPage/UserComponents/prescription';
import DoctorPage from './Components/docStruct';
import AdminPage from './Components/adStruct';
import AdAppmt from './Components/AdminPage/AdComponents/adAppmt';
import AdDoc from './Components/AdminPage/AdComponents/adDoctor';
import AdminLeave from './Components/AdminPage/AdComponents/adLeave';
import AdPatient from './Components/AdminPage/AdComponents/adPatient';
import AdProfile from './Components/AdminPage/AdComponents/adProfile';
import DocAppmt from './Components/DoctorPage/DocComponents/docAppmt';
import DocLeave from './Components/DoctorPage/DocComponents/docLeave';
import DocPatient from './Components/DoctorPage/DocComponents/docPatient';
import DocProfile from './Components/DoctorPage/DocComponents/docProfile';
import DoctorView from './Components/DoctorPage/DocComponents/chart';
import PatientHistory from './Components/DoctorPage/DocComponents/history';
import PatientProfile from './Components/AdminPage/AdComponents/patientprofile';
const App = () => {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WhoAmI />} />
        <Route path="/login/user" element={<Login />} />
        <Route path="/login/staff" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/userpage" element={<UserPage />} />
        <Route path="/userpage/profile" element={<Profile />} />
        <Route path="/userpage/appointment" element={<Appointment />} />
        <Route path="/userpage/prescription" element={<Prescription />} />
        <Route path="/adminpage" element={<AdminPage />} />
        <Route path="/adminpage/appointment" element={<AdAppmt />} />
        <Route path="/adminpage/doctor" element={<AdDoc />} />
        <Route path="/adminpage/leave" element={<AdminLeave />} />
        <Route path="/adminpage/patient" element={<AdPatient />} />
        <Route path="/adminpage/profile" element={<AdProfile />} />
        <Route path="/doctorpage" element={<DoctorPage />} />
        <Route path="/doctorpage/appointment_schedule" element={<DocAppmt />} />
        <Route path="/doctorpage/leave" element={<DocLeave />} />
        <Route path="/doctorpage/patient" element={<DocPatient />} />
        <Route path="/doctorpage/profile" element={<DocProfile />} />
        <Route path="/doctorpage/patient/history" element={<PatientHistory />} />
        <Route path="/doctorpage/appointment_schedule/chart" element={<DoctorView />} />
        <Route path="/admin/patientprofile" element={<PatientProfile />} />

      </Routes>
    </Router>
  );
};

export default App;
