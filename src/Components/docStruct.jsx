import React from 'react';
import DocHead from './DoctorPage/docHead'; 
import DocLeftNav from './DoctorPage/docLeftNav'; 
import DocDash from './DoctorPage/docDash';
import DocHero
 from './DoctorPage/docHero';
const DoctorPage = () => {
  return (
    <div className="flex flex-col h-screen">
      
      {/* Header at the top */}
      <DocHead />
      <DocHero/>
      <div className="flex flex-1">
        
        {/* Left Side Navbar */}
        <DocLeftNav /> 
        
        {/* Responsive Component List */}
        <div className="flex-1 p-4"> 
          <DocDash />
        </div>
      </div>
    </div>
  );
};

export default DoctorPage;
