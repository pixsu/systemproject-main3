const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feedback: { type: String, required: true, minlength: 5, maxlength: 100 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  dateAndTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feedback', feedbackSchema);
