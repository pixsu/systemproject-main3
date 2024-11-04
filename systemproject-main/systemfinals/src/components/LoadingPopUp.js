import React, { useState, useEffect } from 'react';
import './components_css/loadingstyle.css';

// LoadingPopUp component to display an animated loading message
const LoadingPopUp = () => {
  // Array of loading phrases to cycle through
  const phrases = ["Please wait...", "Almost there..."];

  // State to track the current phrase being displayed
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);

  useEffect(() => {
    // Set up an interval to change the phrase every 1 second
    const interval = setInterval(() => {
      setCurrentPhrase(prevPhrase => {
        // Find the index of the current phrase
        const currentIndex = phrases.indexOf(prevPhrase);
        // Calculate the index of the next phrase, cycling back to the first phrase if necessary
        const nextIndex = (currentIndex + 1) % phrases.length;
        return phrases[nextIndex];
      });
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [phrases]);

  return (
    <div className="loading-overlay">
      {/* Display a loading spinner */}
      <div className="loading-spinner"></div>
      {/* Display the current loading phrase */}
      <p>{currentPhrase}</p>
    </div>
  );
};

export default LoadingPopUp;
