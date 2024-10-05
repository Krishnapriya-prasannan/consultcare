import React from 'react';
import LeftSideNavbar from './UserPage/LeftSideNavbar'; 
import ResponsiveComponentList from './UserPage/dash'; 

const UserPage = () => {
  return (
    <div className="flex">
      <LeftSideNavbar /> 
      <div className="flex-1 p-4"> 
        <ResponsiveComponentList />
      </div>
    </div>
  );
};

export default UserPage;