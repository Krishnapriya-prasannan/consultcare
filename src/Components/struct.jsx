import React from 'react';
//import Header from './UserPage/header'; // Import Header component
//import LeftSideNavbar from './UserPage/LeftSideNavbar'; 
import ResponsiveComponentList from './UserPage/dash'; // Import the ResponsiveComponentList component
const UserPage = () => {
    return (
     
      <div className="flex flex-col">
        
      <ResponsiveComponentList />
      
  </div>
        
    );
  };
  

export default UserPage;
