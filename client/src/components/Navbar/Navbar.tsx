import React from 'react';
import { Link } from "react-router-dom"

import { Header } from "../common";

import './Navbar.css'

interface NavbarProps {
  header?: string
}

const logo = require('../../assets/images/logo.png')

const Navbar: React.FC<NavbarProps> = ({
  header=""
}) => {
  return (
    <div className="navbar-main">
      <div className="navbar-content">
        <Link to="/" className="navbar-left">
          <img src={logo} className="nav-logo" />
           iSchedule
        </Link>
        <div className="center-container">
          <Header content={header} />
        </div>
        <div className="navbar-right">
          <Link to="/about" className="navbar-element">About</Link>
          {/* <Link to="/contact" className="navbar-element">Contact</Link> */}
        </div>
      </div>
   </div>
  );
};

export default Navbar;
