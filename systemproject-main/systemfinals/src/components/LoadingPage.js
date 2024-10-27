import React from 'react';
import { useNavigate } from 'react-router-dom';
import './components_css/loadingpagestyle.css';

// import videobg from '../imgs/videobg.mp4';
import logo from '../imgs/websitelogo.png';
import center from '../imgs/lpbanner2.png';

const LoadingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login'); 
  };

  const handleSignup = () => {
    navigate('/signup'); 
  };

  return (
    <div className="loading-page">
      {/* <video autoPlay muted loop className="background-video">
        <source src={videobg} type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}

      <img src={logo} alt="Logo" className="logo" />

      <div className="button-container">
        <button className="btn" onClick={handleLogin}>Log In</button>
        <button className="btn" onClick={handleSignup}>Sign Up</button>
      </div>

      <img src={center} alt="Center Image" className="center-image" />

      <p className='des'>
        Welcome to the official <strong>NU MOA Bulldogs Exchange Merchandise Website! </strong> 
        Explore our exclusive collection of premium merchandise, proudly representing the National University Bulldogs.
      </p>    
    </div>
  );
}

export default LoadingPage;