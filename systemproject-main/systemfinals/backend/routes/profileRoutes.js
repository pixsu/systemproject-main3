const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');

// multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// route to handle profile picture update
router.post('/uploadProfilePic', upload.single('profilePic'), async (req, res) => {
  const userId = req.body.userId;
  const profilePicPath = req.file.path;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profilePic = profilePicPath; // save image path in the database
    await user.save();
    res.status(200).json({ message: 'Profile picture updated successfully', profilePic: profilePicPath });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile picture', error });
  }
});

module.exports = router;
