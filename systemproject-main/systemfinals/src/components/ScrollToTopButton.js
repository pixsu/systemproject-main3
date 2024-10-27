import React, { useState, useEffect } from 'react';
import './components_css/ScrollToTopButton.css';

const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className={`scroll-to-top ${visible ? 'visible' : ''}`} onClick={scrollToTop}>
            <i className="fas fa-chevron-up"></i>
        </div>
    );
};

export default ScrollToTopButton;
