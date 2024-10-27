import React from 'react';
import './components_css/NavBar.css';

import logohome from '../imgs/websitelogo.png';


const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logohome} alt="Logo" />
      </div>
      <ul className="navbar-links">
        <li>
            <a href="/home">Home</a>
        </li>
        <li>
            <a href="/products">Products</a>
        </li>
        <li>
            <a href="#contactsection">Contact</a>
        </li>
        <li>
            <a href="/account">Account</a>
        </li>
        <li>
          <a href="/cart">
            <i className="fas fa-shopping-cart"></i>
          </a>
        </li>
      </ul>
      <div className="navbar-menu">
        <i className="fas fa-bars"></i>
      </div>
    </nav>
  );
};

export default NavBar;