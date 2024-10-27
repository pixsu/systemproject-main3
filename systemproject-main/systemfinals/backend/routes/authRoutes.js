const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/User'); // Ensure the path is correct

// Signup Route
router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, course } = req.body;

  // Check if all fields are filled
  if (!firstName || !lastName || !email || !password || !course) {
    return res.status(400).json({ error: 'Please fill in all fields.' });
  }

  try {
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,  // Store hashed password
      course,
    });
    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'Signup successful!' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Signup failed. Please try again.' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please register.' });
    }

    // Compare provided password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password.' });
    }

    // If login is successful, return the userId or other details as needed
    res.status(200).json({ message: 'Login successful!', userId: user._id }); // Return user ID
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Change password route
router.post('/change-password', async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if current password is correct
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password in the database
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Error during password change:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
