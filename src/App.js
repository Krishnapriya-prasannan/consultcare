import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WhoAmI from './Components/who'; 
import Login from './Components/Login'; 
import Signup from './Components/Signup'; 
import UserPage from './Components/struct'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WhoAmI />} />
        <Route path="/login/user" element={<Login />} /> {/* User login */}
        <Route path="/login/staff" element={<Login />} /> {/* Staff login */}
        <Route path="/signup" element={<Signup />} /> {/* Signup page */}
        <Route path="/userpage" element={<UserPage />} /> {/* User dashboard */}
      </Routes>
    </Router>
  );
};

export default App;
