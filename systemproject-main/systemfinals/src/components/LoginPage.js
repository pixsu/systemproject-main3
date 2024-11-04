import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './components_css/loginpagestyle.css';
import logo2 from '../imgs/websitelogo2.png';
import LoadingPopUp from './LoadingPopUp';

const LoginPage = () => {
  // Define state variables for login form fields, error messages, and UI states
  const [passwordVisible, setPasswordVisible] = useState(false); // Toggles password visibility
  const [email, setEmail] = useState(""); // Stores user's email
  const [password, setPassword] = useState(""); // Stores user's password
  const [errorMessage, setErrorMessage] = useState(""); // Displays error messages
  const [loading, setLoading] = useState(false); // Indicates if the login process is loading

  // Initialize navigation hook for redirection after login
  const navigate = useNavigate();

  // Toggles the visibility of the password input field
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Handles form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email format to ensure it ends with "@students.nu-moa.edu.ph"
    const emailPattern = /^[a-zA-Z0-9._%+-]+@students\.nu-moa\.edu\.ph$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Please enter a valid email address ending with @students.nu-moa.edu.ph.");
      return;
    }

    // Ensure password is at least 8 characters long
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    // Check if password contains at least one uppercase letter and one number
    const passwordUppercasePattern = /(?=.*[A-Z])(?=.*\d)/;
    if (!passwordUppercasePattern.test(password)) {
      setErrorMessage("Password must contain at least one uppercase letter and one number.");
      return;
    }
    setLoading(true); // Show loading spinner during login attempt
    loginUser(); // Call the function to initiate login
  };

  // Function to handle the login request
  const loginUser = async () => {
    try {
      // Send login request to server
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      // If login is successful, save user ID to localStorage and navigate to home page
      if (data.userId) {
        localStorage.setItem('userId', data.userId);
        console.log('User logged in and ID saved to localStorage:', data.userId);
        clearCart(); // Clear any existing cart items for the new user
        completeLogin(); // Complete the login process
        setLoading(true);
      } else {
        // Handle unsuccessful login by displaying an error message
        console.error('Login failed:', data.error);
        setErrorMessage('Login failed. Please check your credentials.');
        setLoading(false); // Stop loading spinner
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Login failed. Please try again.');
      setLoading(false); // Stop loading spinner
    }
  };

  // Function to clear previous user's cart data
  const clearCart = () => {
    localStorage.removeItem('cart'); // Assumes cart is stored in localStorage under 'cart'
    console.log("Previous user's cart cleared");
  };

  // Completes login by stopping loading and navigating to home page
  const completeLogin = () => {
    setTimeout(() => {
      setLoading(false); // Stop loading spinner
      navigate('/home'); // Redirect to home page after successful login
    }, 2000);
  };

  return (
    <section className='bgsec'>
      {/* Show loading popup if loading is true */}
      {loading && <LoadingPopUp />}
      <div className="login-container">
        {/* Display website logo */}
        <img src={logo2} alt="NU MOA Logo" className="logo2" />
        <h2>Log In to continue</h2>
        <p>Please log in with your school email address and password.</p>

        {/* Login form with input fields */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email input field */}
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

          {/* Password input field with toggle visibility */}
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

          {/* Display error message if it exists */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {/* Login button */}
          <button type="submit" className="login-btn">Log In</button>

          {/* Link to signup page */}
          <p className="signup-link">
            Don’t have an account? <a href="/signup">Sign Up</a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
