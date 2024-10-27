const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// Route to submit feedback
router.post('/submit', async (req, res) => {
  const { userId, feedback, rating } = req.body;

  if (!userId || !feedback || !rating) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newFeedback = new Feedback({ userId, feedback, rating });
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback.' });
  }
});

// Route to get feedbacks by userId
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const feedbacks = await Feedback.find({ userId });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Failed to fetch feedbacks.' });
  }
});

module.exports = router;
