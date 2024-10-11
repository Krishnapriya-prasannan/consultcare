import React from 'react';
import Header from './UserPage/header'; 
import LeftSideNavbar from './UserPage/LeftSideNavbar'; 
import ResponsiveComponentList from './UserPage/dash'; 

const UserPage = () => {
  return (
    <div className="flex flex-col h-screen">
      
      {/* Header at the top */}
      <Header />

      <div className="flex flex-1">
        
        {/* Left Side Navbar */}
        <LeftSideNavbar /> 
        
        {/* Responsive Component List */}
        <div className="flex-1 p-4"> 
          <ResponsiveComponentList />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
