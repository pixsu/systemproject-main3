import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './components_css/loginpagestyle.css';
import logo2 from '../imgs/websitelogo2.png';

import LoadingPopUp from './LoadingPopUp';

const LoginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailPattern = /^[a-zA-Z0-9._%+-]+@students\.nu-moa\.edu\.ph$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Please enter a valid email address ending with @students.nu-moa.edu.ph.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    const passwordUppercasePattern = /(?=.*[A-Z])(?=.*\d)/;
    if (!passwordUppercasePattern.test(password)) {
      setErrorMessage("Password must contain at least one uppercase letter and one number.");
      return;
    }
    setLoading(true);
    loginUser();
  };

  const loginUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.userId) {
        localStorage.setItem('userId', data.userId);
        console.log('User logged in and ID saved to localStorage:', data.userId);
        clearCart(); // Clear previous user's cart items
        completeLogin();
      } else {
        console.error('Login failed:', data.error);
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed. Please try again.');
    }
  };

  const clearCart = () => {
    localStorage.removeItem('cart'); // Assuming your cart is stored in localStorage under 'cart'
    console.log('Previous user\'s cart cleared');
  };

  const completeLogin = () => {
    setTimeout(() => {
      setLoading(false);
      navigate('/home');
    }, 2000);
  };

  return (
    <section className='bgsec'>
      {loading && <LoadingPopUp />} {/* show loading component when loading */}
      <div className="login-container">
        <img src={logo2} alt="NU MOA Logo" className="logo2" />
        <h2>Log In to continue</h2>
        <p>Please log in with your school email address and password.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              placeholder="School Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <i className="fas fa-lock"></i>
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i
              className={passwordVisible ? "fas fa-eye-slash" : "fas fa-eye"}
              onClick={togglePasswordVisibility}
              style={{ cursor: 'pointer' }}
            ></i>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}  {/* Show error messages */}

          <button type="submit" className="login-btn">Log In</button>

          <p className="signup-link">
            Don’t have an account? <a href="/signup">Sign Up</a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
