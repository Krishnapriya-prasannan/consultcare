import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WhoAmI from './Components/who'; // Adjust path if necessary
import Login from './Components/Login'; // Adjust path if necessary
import Signup from './Components/Signup'; // Adjust path if necessary

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WhoAmI />} />
        <Route path="/login/user" element={<Login />} />
        <Route path="/login/staff" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;
