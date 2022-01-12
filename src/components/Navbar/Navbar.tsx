import React from 'react';
import './Navbar.css'

const Navbar: React.FC = () => {

  return (
    <div className="navbar-main">
      <div className="navbar-content">
        <div className="navbar-left">
          Find a time.
        </div>
        <div className="navbar-right">
          <div className="navbar-element">About</div>
          <div className="navbar-element">About</div>
        </div>
      </div>
   </div>
  );
};

export default Navbar;
