import React, { useState } from 'react';
import './components_css/changepassstyle.css';

const ChangePasswordPopup = ({ onClose, onChangePassword }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    };

    // validations before submit
    const handleSubmit = () => {
        setPasswordError('');
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('All fields are required');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('New password and confirmation do not match');
            return;
        }
        if (!validatePassword(newPassword)) {
            setPasswordError('Password must contain at least 8 characters, one uppercase letter, and one number.');
            return;
        }

        onChangePassword(currentPassword, newPassword);
        onClose();
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Change Password</h2>
                <div className="form-group">
                    <label>Current Password:</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Confirm New Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                {passwordError && <p className="error-message">*{passwordError}*</p>}
                <div className='buttons'>
                    <button className='changepass' onClick={handleSubmit}>Change Password</button>
                    <button className='cancelbtn' onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPopup;
