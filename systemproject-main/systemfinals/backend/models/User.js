const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, maxlength: 10 },
  lastName: { type: String, required: true, maxlength: 10 },
  email: { type: String, required: true, unique: true, match: /^[a-zA-Z0-9._%+-]+@students\.nu-moa\.edu\.ph$/ },
  password: { type: String, required: true, minlength: 8 },
  course: { type: String, required: true },
  profilePic: { type: String }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
