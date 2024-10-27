import React, { useState, useEffect } from 'react';
import './components_css/loadingstyle.css'; 

const LoadingPopUp = () => {
  const phrases = ["Please wait...", "Almost there..."];
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase(prevPhrase => {
        const currentIndex = phrases.indexOf(prevPhrase);
        const nextIndex = (currentIndex + 1) % phrases.length; 
        return phrases[nextIndex];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phrases]);

  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <p>{currentPhrase}</p>
    </div>
  );
};

export default LoadingPopUp;