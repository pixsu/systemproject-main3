import React from 'react';
import { useNavigate } from 'react-router-dom';

import './components_css/contactsectionstyle.css';
import logocontact from '../imgs/websitelogo2.png';

// ContactSection component displays contact information and links to social media
const ContactSection = ({ setSelectedCategory }) => {
  const navigate = useNavigate();

  // Navigate to the products page and filter by the selected category
  const handleCategoryClick = (category) => {
    setSelectedCategory(category); // Update the selected category in the state
    navigate('/products'); // Redirect user to the products page
  };

  return (
    <div>
      <section id='contactsection'>
        {/* Section Header */}
        <h1>Support our socials!</h1>
        <p>Stay connected and up-to-date with the latest news, offers, and updates. Follow us on our social media channels and help us grow!</p>

        {/* Contact Box containing details about the shop, navigation links, and social media */}
        <div className='contactbox'>

          {/* Content1: Basic shop information */}
          <div className='content1'>
            <img src={logocontact} alt="Logo" />
            <h1>NU MOA Bulldogs Exchange</h1>
            <p>Your one-stop shop for exclusive NU MOA merchandise and more! Pre-order, pick up, and represent your school with pride.</p>
          </div>

          {/* Content2: Quick navigation links for shopping by category */}
          <div className='content2'>
            <h2>Shop</h2>
            <ul>
              {/* Link to the 'College' category */}
              <li><a href="#" onClick={() => handleCategoryClick('college')}>College</a></li>

              {/* Link to the 'Senior High School' category */}
              <li><a href="#" onClick={() => handleCategoryClick('senior high school')}>Senior High School</a></li>

              {/* Link to the 'Merchandise' category */}
              <li><a href="#" onClick={() => handleCategoryClick('merchandise')}>Merchandise</a></li>
            </ul>
          </div>

          {/* Content3: Social media and contact information */}
          <div className='content3'>
            <h2>Socials</h2>
            {/* Link to Facebook page */}
            <a href="https://www.facebook.com/NUMOAph"><i className="fab fa-facebook"></i>: @NUMOAph</a>

            {/* Contact information */}
            <h2>Contact Us!</h2>
            <a href="tel:+639985960424">(+63) 998 596 0424</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactSection;
