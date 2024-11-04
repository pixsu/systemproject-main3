import React, { useState, useEffect, useRef } from 'react';
import './components_css/feedbackform.css';

// FeedbackPage component for collecting user feedback and displaying a thank-you message
const FeedbackPage = () => {
  // State to manage visibility of feedback form
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  // State to store feedback text
  const [feedback, setFeedback] = useState('');
  // State to store user's rating
  const [rating, setRating] = useState(0);
  // State to store hover rating for visual feedback
  const [hoverRating, setHoverRating] = useState(0);
  // State to manage visibility of thank-you message
  const [thankYouMessageVisible, setThankYouMessageVisible] = useState(false);
  // State to store thank-you message text based on rating
  const [thankYouMessage, setThankYouMessage] = useState('');
  // State to store the timestamp when feedback is submitted
  const [timestamp, setTimestamp] = useState('');
  // Reference to feedback form element to detect outside clicks
  const feedbackRef = useRef(null);

  const minCharacterCount = 5; // Minimum characters required for feedback
  const maxCharacterCount = 100; // Maximum allowed characters for feedback

  // Toggle feedback form visibility
  const toggleFeedbackForm = () => {
    setIsFeedbackVisible(!isFeedbackVisible);
  };

  // Generate thank-you message based on user's rating
  const getThankYouMessage = () => {
    switch (rating) {
      case 1:
        return "Thank you for your feedback. We'll work on improving!";
      case 2:
        return "Thanks! We're always looking for ways to get better.";
      case 3:
        return "Thank you! We appreciate your balanced feedback.";
      case 4:
        return "Thanks a lot! We're glad you had a good experience.";
      case 5:
        return "Awesome! Thank you for your great feedback!";
      default:
        return "Thank you for your feedback!";
    }
  };

  // Handle feedback form submission
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    // Validate feedback character count
    const trimmedFeedbackLength = feedback.replace(/\s+/g, '').length;
    if (trimmedFeedbackLength < minCharacterCount || trimmedFeedbackLength > maxCharacterCount) {
      alert(`Feedback must be between ${minCharacterCount} and ${maxCharacterCount} characters.`);
      return;
    }

    // Retrieve userId from localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User not logged in.');
      return;
    }

    // Get current date and time and set timestamp state
    const currentDateTime = new Date().toLocaleString();
    setTimestamp(currentDateTime);

    try {
      // Send feedback data to the server
      const response = await fetch('http://localhost:5000/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, feedback, rating }),
      });

      const data = await response.json();
      if (response.ok) {
        // Reset feedback form and display thank-you message
        setIsFeedbackVisible(false);
        setFeedback('');
        setRating(0);
        setThankYouMessage(getThankYouMessage());
        setThankYouMessageVisible(true);
        setTimeout(() => {
          setThankYouMessageVisible(false); // Hide message after 3 seconds
        }, 3000);
      } else {
        console.error('Failed to submit feedback:', data.error);
        alert(data.error);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback.');
    }
  };

  // Close feedback form when user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (feedbackRef.current && !feedbackRef.current.contains(event.target)) {
        setIsFeedbackVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [feedbackRef]);

  // Handle star rating selection
  const handleStarClick = (ratingValue) => {
    setRating(ratingValue);
  };

  // Handle hover effect for star rating
  const handleStarHover = (ratingValue) => {
    setHoverRating(ratingValue);
  };

  // Reset hover rating when user stops hovering over stars
  const handleStarHoverLeave = () => {
    setHoverRating(0);
  };

  // Count current feedback characters excluding whitespace
  const currentCharacterCount = feedback.replace(/\s+/g, '').length;

  return (
    <div>
      {/* Button to toggle feedback form visibility */}
      <button className="feedback-icon-btn" onClick={toggleFeedbackForm}>
        <i className="fas fa-comment"></i>
      </button>

      {/* Feedback form popup */}
      <div ref={feedbackRef} className={`feedback-floating-window ${isFeedbackVisible ? 'feedback-visible' : ''}`}>
        {isFeedbackVisible && (
          <>
            <button className="close-feedback-btn" onClick={toggleFeedbackForm}>
              &times;
            </button>
            <h3>Submit Your Feedback</h3>
            <form onSubmit={handleSubmitFeedback}>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your feedback here... (5-100 characters)"
                className="feedback-textarea"
                required
              />
              {/* Character counter, highlights if limit exceeded */}
              <div className={`character-counter ${currentCharacterCount > maxCharacterCount ? 'exceeds-limit' : ''}`}>
                {currentCharacterCount}/{maxCharacterCount}
              </div>
              {/* Star rating section */}
              <div className="star-rating">
                {[...Array(5)].map((star, index) => {
                  const ratingValue = index + 1;
                  return (
                    <i
                      key={index}
                      className={`fas fa-star ${ratingValue <= (hoverRating || rating) ? 'star-filled' : ''}`}
                      onClick={() => handleStarClick(ratingValue)}
                      onMouseEnter={() => handleStarHover(ratingValue)}
                      onMouseLeave={handleStarHoverLeave}
                    ></i>
                  );
                })}
              </div>
              {/* Submit button, disabled if character count is invalid */}
              <button
                type="submit"
                className="submit-feedback-btn"
                disabled={currentCharacterCount < minCharacterCount || currentCharacterCount > maxCharacterCount}
              >
                Submit
              </button>
            </form>
          </>
        )}
      </div>

      {/* Thank you message displayed upon successful feedback submission */}
      {thankYouMessageVisible && (
        <div className="thank-you-message">
          {thankYouMessage} <br /> {/* Display the thank-you message */}
          {timestamp && <span>Submitted on: {timestamp}</span>} {/* Display the timestamp */}
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
