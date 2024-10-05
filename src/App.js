import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WhoAmI from './Components/who';
import Login from './Components/Login';
import Signup from './Components/Signup';
import UserPage from './Components/struct';
import Profile from './Components/UserPage/profile';
import Appointment from './Components/UserPage/appointment';
import Prescription from './Components/UserPage/prescription';

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
      </Routes>
    </Router>
  );
};

export default App;
