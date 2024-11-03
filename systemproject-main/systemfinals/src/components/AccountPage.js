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

const AccountPage = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [user, setUser] = useState(null); // State to store fetched user details
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        // Fetch user details on component load
        const fetchUserDetails = async () => {
            const userId = localStorage.getItem('userId'); // Retrieve user ID from localStorage
            if (!userId) {
                console.error('No user ID found in localStorage');
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/api/${userId}`);
                const data = await response.json();
                if (data.user) {
                    setUser(data.user); // Store fetched user details in state
                    setProfilePic(data.user.profilePic || null); // Set the saved profile picture or default
                    localStorage.setItem('userDetails', JSON.stringify(data.user));  // Save to localStorage
                } else {
                    console.error('Failed to fetch user details:', data.message);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails(); // Call the fetch function
    }, []);

    const toLogout = () => {
        localStorage.removeItem('userId'); // Clear user ID from localStorage on logout
        localStorage.removeItem('cart'); // Clear the cart data

        setIsModalOpen(false);
        setUser(null); // Clear the user state
        navigate('/login');
    };

    const handleLogoutClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirmLogout = () => {
        toLogout();

    };

    const handleCancelLogout = () => {
        setIsModalOpen(false);
    };

    // delete account
    const handleDeleteAccountClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDeleteAccount = async () => {
        const userId = localStorage.getItem('userId'); // Get the current user ID

        try {
            const response = await fetch(`http://localhost:5000/api/auth/deleteAccount/${userId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                // Successfully deleted, log the user out and navigate to login
                localStorage.removeItem('userId');
                localStorage.removeItem('userDetails');
                alert(data.message); // Show a success message
                navigate('/login');
            } else {
                console.error('Failed to delete account:', data.message);
                alert('Failed to delete account');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Something went wrong, please try again.');
        }

        setIsDeleteModalOpen(false); // Close the modal
    };

    const handleCancelDeleteAccount = () => {
        setIsDeleteModalOpen(false);
    };

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file); // store the file for uploading later
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);

            };
            reader.readAsDataURL(file);
            setSelectedFile(file);
        }
    };

    const handleSave = async () => {
        const userId = localStorage.getItem('userId');

        if (selectedFile) {
            const formData = new FormData();
            formData.append('profilePic', selectedFile); // add the selected file
            formData.append('userId', userId); // send the user ID

            try {
                const response = await fetch('http://localhost:5000/api/uploadProfilePic', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                if (response.ok) {
                    setProfilePic(data.profilePic); // Update the profile picture state
                } else {
                    console.error('Failed to update profile picture:', data.message);
                    alert('Failed to update profile picture');
                }
            } catch (error) {
                console.error('Error updating profile picture:', error);
                alert('Something went wrong, please try again.');
            }
        }

        handleEditClick();
        setSelectedFile(null);
    };

    const handleChangePassword = async (currentPassword, newPassword) => {
        const userId = localStorage.getItem('userId'); // Assuming you have the userId in localStorage

        try {
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
                alert('Password changed successfully!');
            } else {
                console.error('Failed to change password:', data.error);
                alert(data.error);
            }
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    const setSelectedCategory = (category) => {
        navigate('/products', { state: { selectedCategory: category } });
    };

    if (!user) {
        return <div>Loading...</div>; // Show a loading state while fetching user details
    }

    return (
        <div>
            <NavBar />

            <section className='top'>
                <div id="account-settings">
                    <h2 className='title'>Account Settings</h2>
                    <div className="account-info">
                        <h3>My Account</h3>
                        <div className="account-details">
                            <img
                                src={profilePic
                                    ? (profilePic.startsWith('http') ? profilePic : `http://localhost:5000/${profilePic}`)
                                    : defpfp // If no profilePic, show the default image
                                }
                                alt="Profile Picture"
                                className="profile-pic"
                            />
                            <div className="info">
                                <h4>{user.firstName} {user.lastName}</h4>
                                <p>{user.course}</p>
                            </div>
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

                        {isEditing && (
                            <div className="file-input-group">
                                <label className="file-input-label">Choose a new profile picture:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="file-input"
                                />
                                {selectedFile && (
                                    <p style={{ marginTop: '10px' }}>Selected File: {selectedFile.name}</p>
                                )}
                            </div>
                        )}

                        <h3>Personal Information</h3>
                        <div className="personal-info">
                            <div className="info-item">
                                <strong>Last Name</strong>
                                <p>{user.lastName}</p>
                            </div>
                            <div className="info-item">
                                <strong>First Name</strong>
                                <p>{user.firstName}</p>
                            </div>
                            <div className="info-item">
                                <strong>Course</strong>
                                <p>{user.course}</p>
                            </div>
                            <div className="info-item">
                                <strong>School Email</strong>
                                <p>{user.email}</p>
                            </div>
                            <div className="info-item">
                                <strong>Password</strong>
                                <button className='changepassbtn' onClick={() => setIsChangingPassword(true)}>Change Password</button>
                            </div>
                        </div>

                        <div className="accbutton-container">
                            <button className="logout" onClick={handleLogoutClick}>Logout</button>
                            <button className="delacc" onClick={handleDeleteAccountClick}>Delete Account</button>
                        </div>
                    </div>
                </div>
            </section>

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

            {/* Confirmation Modal for Delete Account */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDeleteAccount}
                onConfirm={handleConfirmDeleteAccount}
                message="Are you sure you want to delete your account?"
            />

            <ContactSection setSelectedCategory={setSelectedCategory} />
            <FeedbackPage />
            <ScrollToTopButton />
        </div>
    );
};

export default AccountPage;
