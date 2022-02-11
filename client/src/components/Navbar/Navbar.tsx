import React from 'react';
import { Link } from "react-router-dom"

import { Header } from "../common";

import './Navbar.css'

interface NavbarProps {
  header?: string
}

const Navbar: React.FC<NavbarProps> = ({
  header=""
}) => {
  return (
    <div className="navbar-main">
      <div className="navbar-content">
        <Link to="/" className="navbar-left">
          W2M 2.0
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
