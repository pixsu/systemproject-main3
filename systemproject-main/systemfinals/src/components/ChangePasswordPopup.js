import React, { useState } from 'react';
import './components_css/changepassstyle.css';

// ChangePasswordPopup component to handle password change functionality
const ChangePasswordPopup = ({ onClose, onChangePassword }) => {
    // State to store current password input
    const [currentPassword, setCurrentPassword] = useState('');
    // State to store new password input
    const [newPassword, setNewPassword] = useState('');
    // State to store confirmation of new password input
    const [confirmPassword, setConfirmPassword] = useState('');
    // State to display error messages related to password validation
    const [passwordError, setPasswordError] = useState('');

    // Function to validate new password requirements (at least 8 characters, one uppercase letter, and one number)
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    };

    // Handle form submission and validate inputs
    const handleSubmit = () => {
        // Clear any existing password errors
        setPasswordError('');

        // Check if any fields are empty
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('All fields are required');
            return;
        }

        // Check if new password matches the confirmation password
        if (newPassword !== confirmPassword) {
            setPasswordError('New password and confirmation do not match');
            return;
        }

        // Validate the new password against requirements
        if (!validatePassword(newPassword)) {
            setPasswordError('Password must contain at least 8 characters, one uppercase letter, and one number.');
            return;
        }

        // If validation passes, trigger onChangePassword function with current and new passwords
        onChangePassword(currentPassword, newPassword);

        // Close the popup after successful submission
        onClose();
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Change Password</h2>

                {/* Current Password Input */}
                <div className="form-group">
                    <label>Current Password:</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>

                {/* New Password Input */}
                <div className="form-group">
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                {/* Confirm New Password Input */}
                <div className="form-group">
                    <label>Confirm New Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                {/* Display error message if validation fails */}
                {passwordError && <p className="error-message">*{passwordError}*</p>}

                {/* Buttons for submitting or canceling password change */}
                <div className='buttons'>
                    <button className='changepass' onClick={handleSubmit}>Change Password</button>
                    <button className='cancelbtn' onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPopup;
