import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingPopUp from './LoadingPopUp';

import './components_css/signuppagestyle.css';
import logo3 from '../imgs/websitelogo2.png';

const SignUpPage = () => {
  // Define state variables for form fields and UI behavior
  const [passwordVisible, setPasswordVisible] = useState(false); // Toggles password visibility
  const [selectedCourse, setSelectedCourse] = useState(""); // Stores the selected course
  const [email, setEmail] = useState(""); // Stores the user's email
  const [password, setPassword] = useState(""); // Stores the user's password
  const [confirmPassword, setConfirmPassword] = useState(""); // Stores the password confirmation
  const [firstName, setFirstName] = useState(""); // Stores the user's first name
  const [lastName, setLastName] = useState(""); // Stores the user's last name
  const [loading, setLoading] = useState(false); // Indicates if the signup process is loading
  const [errorMessage, setErrorMessage] = useState(""); // Stores error messages for validation

  // Toggles the visibility of the password input field
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Initialize navigation hook to redirect after signup
  const navigate = useNavigate();

  // Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous error message

    // Validate email format to ensure it ends with "@students.nu-moa.edu.ph"
    const emailPattern = /^[a-zA-Z0-9._%+-]+@students\.nu-moa\.edu\.ph$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Please enter a valid email address ending with @students.nu-moa.edu.ph.");
      return;
    }

    // Validate that first and last names are no more than 10 characters
    if (firstName.length > 10 || lastName.length > 10) {
      setErrorMessage("First and Last names must be 10 characters or less.");
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

    // Confirm that passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Verify that a course has been selected
    if (!selectedCourse) {
      setErrorMessage("Please select your course.");
      return;
    }

    try {
      setLoading(true); // Show loading spinner while waiting for response

      // Send signup request to server
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        firstName,
        lastName,
        email,
        password,
        course: selectedCourse,
      });

      // Redirect to login page if signup was successful
      if (response.status === 201) {
        navigate('/login');
      } else {
        // Handle unexpected response status here (optional)
      }
    } catch (error) {
      console.error("Error during signup:", error);
    } finally {
      completeSignup(); // Complete signup process by hiding the loader and navigating
    }
  };

  // Completes signup by stopping loading, clearing errors, and redirecting to login
  const completeSignup = () => {
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
      setErrorMessage(""); // Clear error message on completion
    }, 2000);
  };

  return (
    <section className='bgsec'>
      {/* Show loading popup if loading is true */}
      {loading && <LoadingPopUp />}
      <div className="signup-container">
        {/* Display logo */}
        <img src={logo3} alt="NU MOA Logo" className="signup-logo" />
        <h2>Sign Up to continue</h2>
        <p>Please enter your school email address and password.</p>

        {/* Display error message if it exists */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Signup form with input fields */}
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* First Name and Last Name input fields */}
          <div className="name-inputs">
            <div className="name-input-group">
              <input
                type="text"
                placeholder="First Name"
                required
                maxLength={10}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="name-input-group">
              <input
                type="text"
                placeholder="Last Name"
                required
                maxLength={10}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Email input field */}
          <div className="email-input-group">
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
          <div className="password-input-group">
            <i className="fas fa-lock"></i>
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              required
              minLength={8}
              maxLength={20}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i
              className={passwordVisible ? "fas fa-eye-slash" : "fas fa-eye"}
              onClick={togglePasswordVisibility}
              style={{ cursor: 'pointer' }}
            ></i>
          </div>

          {/* Confirm Password input field */}
          <div className="confirmpassword-input-group">
            <i className="fas fa-lock"></i>
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Confirm Password"
              required
              minLength={8}
              maxLength={20}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <i
              className={passwordVisible ? "fas fa-eye-slash" : "fas fa-eye"}
              onClick={togglePasswordVisibility}
              style={{ cursor: 'pointer' }}
            ></i>
          </div>

          {/* Course selection dropdown */}
          <div className="course-input-group">
            <select
              required
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="" disabled>Select Your Course</option>
              {/* List of course options */}
              <option value="BS Architecture">BS Architecture</option>
              <option value="BS Financial Management">BS Financial Management</option>
              <option value="BS Information Technology - MWA">BS Information Technology - MWA</option>
              <option value="BS Marketing Management">BS Marketing Management</option>
              <option value="BS Medical Technology">BS Medical Technology</option>
              <option value="BS Nursing">BS Nursing</option>
              <option value="BS Psychology">BS Psychology</option>
              <option value="Doctor of Dental Medicine">Doctor of Dental Medicine</option>
              <option value="Doctor of Optometry">Doctor of Optometry</option>
              <option value="Senior High School">Senior High School</option>
            </select>
          </div>

          {/* Signup button */}
          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          {/* Link to login page */}
          <p className="login-link">
            Already have an account? <a href="/login">Log In</a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignUpPage;
