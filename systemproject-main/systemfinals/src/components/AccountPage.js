import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './components_css/accountspagestyle.css';
import ScrollToTopButton from './ScrollToTopButton';
import FeedbackPage from './FeedbackPage';
import NavBar from './NavBar';
import defpfp from '../imgs/defaultpfp.jpg';
import ContactSection from './ContactSection';
import ChangePasswordPopup from './ChangePasswordPopup';
import ConfirmationModal from './ConfirmationModal';

// AccountPage component handles the user's account settings and profile management
const AccountPage = () => {
    const navigate = useNavigate(); // Hook to navigate programmatically
    const [isEditing, setIsEditing] = useState(false); // State to track if the user is editing their profile
    const [profilePic, setProfilePic] = useState(null); // State to store the profile picture URL
    const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file for profile picture upload
    const [currentPassword, setCurrentPassword] = useState(''); // State for current password input
    const [newPassword, setNewPassword] = useState(''); // State for new password input
    const [confirmPassword, setConfirmPassword] = useState(''); // State for confirming new password
    const [isChangingPassword, setIsChangingPassword] = useState(false); // State to toggle password change popup
    const [user, setUser] = useState(null); // State to store fetched user details
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control logout confirmation modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State to control delete account confirmation modal

    useEffect(() => {
        // Fetch user details when the component mounts
        const fetchUserDetails = async () => {
            const userId = localStorage.getItem('userId'); // Retrieve user ID from localStorage
            if (!userId) {
                console.error('No user ID found in localStorage');
                return;
            }

            try {
                // Make an API call to fetch user details
                const response = await fetch(`http://localhost:5000/api/${userId}`);
                const data = await response.json();
                if (data.user) {
                    setUser(data.user); // Store fetched user details in state
                    setProfilePic(data.user.profilePic || null); // Set the profile picture or null if not available
                    localStorage.setItem('userDetails', JSON.stringify(data.user)); // Save user details to localStorage
                } else {
                    console.error('Failed to fetch user details:', data.message);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails(); // Invoke the function to fetch user details
    }, []);

    // Function to handle user logout
    const toLogout = () => {
        localStorage.removeItem('userId'); // Remove user ID from localStorage
        localStorage.removeItem('cart'); // Remove cart data from localStorage

        setIsModalOpen(false); // Close the logout confirmation modal
        setUser(null); // Clear user state
        navigate('/login'); // Redirect to the login page
    };

    // Handler to open the logout confirmation modal
    const handleLogoutClick = () => {
        setIsModalOpen(true);
    };

    // Handler to confirm logout action
    const handleConfirmLogout = () => {
        toLogout();
    };

    // Handler to cancel logout action
    const handleCancelLogout = () => {
        setIsModalOpen(false);
    };

    // Handler to open the delete account confirmation modal
    const handleDeleteAccountClick = () => {
        setIsDeleteModalOpen(true);
    };

    // Handler to confirm account deletion
    const handleConfirmDeleteAccount = async () => {
        const userId = localStorage.getItem('userId'); // Get the current user ID

        try {
            // Make an API call to delete the user account
            const response = await fetch(`http://localhost:5000/api/auth/deleteAccount/${userId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                // If deletion is successful, remove user data and redirect to login
                localStorage.removeItem('userId');
                localStorage.removeItem('userDetails');
                alert(data.message); // Show success message
                navigate('/login'); // Redirect to login page
            } else {
                console.error('Failed to delete account:', data.message);
                alert('Failed to delete account'); // Show error message
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Something went wrong, please try again.'); // Show generic error message
        }

        setIsDeleteModalOpen(false); // Close the delete confirmation modal
    };

    // Handler to cancel account deletion
    const handleCancelDeleteAccount = () => {
        setIsDeleteModalOpen(false);
    };

    // Handler to toggle edit mode
    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    // Handler for file input change (profile picture selection)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file); // Store the selected file for uploading

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result); // Preview the selected profile picture
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    // Handler to save the edited profile
    const handleSave = async () => {
        const userId = localStorage.getItem('userId'); // Get the user ID

        if (selectedFile) {
            const formData = new FormData();
            formData.append('profilePic', selectedFile); // Append the selected file to form data
            formData.append('userId', userId); // Append the user ID to form data

            try {
                // Make an API call to upload the new profile picture
                const response = await fetch('http://localhost:5000/api/uploadProfilePic', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                if (response.ok) {
                    setProfilePic(data.profilePic); // Update the profile picture state with the new URL
                } else {
                    console.error('Failed to update profile picture:', data.message);
                    alert('Failed to update profile picture'); // Show error message
                }
            } catch (error) {
                console.error('Error updating profile picture:', error);
                alert('Something went wrong, please try again.'); // Show generic error message
            }
        }

        handleEditClick(); // Exit edit mode
        setSelectedFile(null); // Clear the selected file
    };

    // Handler to change the user's password
    const handleChangePassword = async (currentPassword, newPassword) => {
        const userId = localStorage.getItem('userId'); // Get the user ID

        try {
            // Make an API call to change the password
            const response = await fetch('http://localhost:5000/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Password changed successfully!'); // Show success message
            } else {
                console.error('Failed to change password:', data.error);
                alert(data.error); // Show error message from the server
            }
        } catch (error) {
            console.error('Error changing password:', error);
        }
    }; 

    // Function to navigate to the products page with a selected category
    const setSelectedCategory = (category) => {
        navigate('/products', { state: { selectedCategory: category } });
    };

    // If user data is not yet loaded, show a loading message
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {/* Navigation Bar */}
            <NavBar />

            <section className='top'>
                <div id="account-settings">
                    <h2 className='title'>Account Settings</h2>
                    <div className="account-info">
                        <h3>My Account</h3>
                        <div className="account-details">
                            {/* Display user's profile picture */}
                            <img
                                src={profilePic
                                    ? (profilePic.startsWith('http') ? profilePic : `http://localhost:5000/${profilePic}`)
                                    : defpfp // If no profilePic, show the default image
                                }
                                alt="Profile Picture"
                                className="profile-pic"
                            />
                            <div className="info">
                                {/* Display user's full name and course */}
                                <h4>{user.firstName} {user.lastName}</h4>
                                <p>{user.course}</p>
                            </div>
                            {/* Button to toggle edit mode or save changes */}
                            <button
                                className="edit-button"
                                onClick={isEditing ? handleSave : handleEditClick}
                                style={{
                                    backgroundColor: isEditing ? '#f6d130' : '',
                                }}
                            >
                                {isEditing ? 'Save' : 'Edit'}
                            </button>
                        </div>

                        {/* Show file input for profile picture when in edit mode */}
                        {isEditing && (
                            <div className="file-input-group">
                                <label className="file-input-label">Choose a new profile picture:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="file-input"
                                />
                                {/* Display the name of the selected file */}
                                {selectedFile && (
                                    <p style={{ marginTop: '10px' }}>Selected File: {selectedFile.name}</p>
                                )}
                            </div>
                        )}

                        <h3>Personal Information</h3>
                        <div className="personal-info">
                            {/* Display user's last name */}
                            <div className="info-item">
                                <strong>Last Name</strong>
                                <p>{user.lastName}</p>
                            </div>
                            {/* Display user's first name */}
                            <div className="info-item">
                                <strong>First Name</strong>
                                <p>{user.firstName}</p>
                            </div>
                            {/* Display user's course */}
                            <div className="info-item">
                                <strong>Course</strong>
                                <p>{user.course}</p>
                            </div>
                            {/* Display user's email */}
                            <div className="info-item">
                                <strong>School Email</strong>
                                <p>{user.email}</p>
                            </div>
                            {/* Button to open change password popup */}
                            <div className="info-item">
                                <strong>Password</strong>
                                <button className='changepassbtn' onClick={() => setIsChangingPassword(true)}>Change Password</button>
                            </div>
                        </div>

                        {/* Container for Logout and Delete Account buttons */}
                        <div className="accbutton-container">
                            <button className="logout" onClick={handleLogoutClick}>Logout</button>
                            <button className="delacc" onClick={handleDeleteAccountClick}>Delete Account</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Render ChangePasswordPopup if the user is changing their password */}
            {isChangingPassword && (
                <ChangePasswordPopup
                    onClose={() => setIsChangingPassword(false)}
                    onChangePassword={handleChangePassword}
                />
            )}

            {/* Confirmation Modal for Logout */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCancelLogout}
                onConfirm={handleConfirmLogout}
            />

            {/* Confirmation Modal for Delete Account with a custom message */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDeleteAccount}
                onConfirm={handleConfirmDeleteAccount}
                message="Are you sure you want to delete your account?"
            />

            {/* Additional sections and components */}
            <ContactSection setSelectedCategory={setSelectedCategory} />
            <FeedbackPage />
            <ScrollToTopButton />
        </div>
    );
};

export default AccountPage;
