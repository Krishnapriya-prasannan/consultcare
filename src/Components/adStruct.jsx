import React from 'react';
import AdHead from './AdminPage/adHead'; 
import AdLeftNav from './AdminPage/adLeftNav'; 
import AdDash from './AdminPage/adDash';
import AdHero from './AdminPage/adHero';
const AdminPage = () => {
  return (
    <div className="flex flex-col h-screen">
      
      {/* Header at the top */}
      <AdHead />
      <AdHero/>
      <div className="flex flex-1">
        
        {/* Left Side Navbar */}
        <AdLeftNav /> 
        
        {/* Responsive Component List */}
        <div className="flex-1 p-4"> 
          <AdDash />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
