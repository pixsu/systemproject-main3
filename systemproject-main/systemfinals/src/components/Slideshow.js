import React, { useState } from 'react';
import './components_css/slideshow.css';

import slide1 from '../imgs/slideshow/ss1.jpg';
import slide2 from '../imgs/slideshow/ss2.jpg';
import slide3 from '../imgs/slideshow/ss3.jpg';
import slide4 from '../imgs/slideshow/ss4.jpg';
import slide5 from '../imgs/slideshow/ss5.jpg';
import slide6 from '../imgs/slideshow/ss6.jpg';
import slide7 from '../imgs/slideshow/ss7.jpg';

const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7];

const Slideshow = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
    };

    return (
        <div className='nubetext'>
          <h1>NU MOA Bulldogs Exchange</h1>
          <p>The NU MOA Bulldogs Exchange is your one-stop shop for official National University merchandise. We celebrate the spirit and pride of the Bulldogs community. Whether you're a student, alumni, or fan, our collection helps you wear your loyalty with pride!</p>
          <div className="slideshow-container">
            <button className="prev" onClick={prevSlide}>❮</button>
            <img src={slides[currentSlide]} alt={`Slide ${currentSlide + 1}`} className="slide" />
            <button className="next" onClick={nextSlide}>❯</button>
            <div className="dots">
                {slides.map((_, index) => (
                    <span 
                        key={index} 
                        className={`dot ${index === currentSlide ? 'active' : ''}`} 
                        onClick={() => setCurrentSlide(index)}
                    ></span>
                ))}
            </div>
        </div>
        </div>
    );
};

export default Slideshow;
