import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './components_css/homepagestyle.css';
import NavBar from './NavBar';
import ScrollToTopButton from './ScrollToTopButton';
import FeedbackPage from './FeedbackPage';

import f1 from "../imgs/f1.png";
import f2 from "../imgs/f2.png";
import f3 from "../imgs/f3.png";
import tumbler from "../imgs/tumbler.png";
import ContactSection from './ContactSection';
import Slideshow from './Slideshow';

const HomePage = () => {
  // Default product list for featured products section
  const [products, setProducts] = useState([
    {
      id: 7,
      name: 'Bulldogs Cap',
      price: 199,
      image: require('../imgs/merch/merch_nucap.png'),
      selectedSize: '',
      category: 'merchandise',
      description: 'A trendy cap for Bulldogs fans.'
    },
    {
      id: 8,
      name: 'NU Drawstring Bag',
      price: 149,
      image: require('../imgs/merch/merch_drawstring.png'),
      selectedSize: '',
      category: 'merchandise',
      description: 'A convenient drawstring bag for daily use.'
    },
    {
      id: 9,
      name: 'Bulldog Stuffed Toy',
      price: 299,
      image: require('../imgs/merch/merch_plushie.png'),
      selectedSize: '',
      category: 'merchandise',
      description: 'A cute Bulldog plush toy for school spirit.'
    },
    {
      id: 10,
      name: 'NU Tumbler',
      price: 399,
      image: require('../imgs/merch/merch_tumbler.png'),
      selectedSize: '',
      category: 'merchandise',
      description: 'A durable tumbler for on-the-go drinks.'
    }
  ]);

  const [isVisible, setIsVisible] = useState(false); // Tracks visibility of the "What's New" section
  const whatsNewRef = useRef(null); // Reference to "What's New" section for intersection observer
  const navigate = useNavigate();

  // Navigate to products page
  const viewallproducts = () => {
    navigate('/products');
  };

  // Intersection observer to reveal "What's New" section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true); // Makes section visible when it enters the viewport
        observer.disconnect();
      }
    });

    if (whatsNewRef.current) {
      observer.observe(whatsNewRef.current);
    }

    return () => {
      if (whatsNewRef.current) {
        observer.unobserve(whatsNewRef.current);
      }
    };
  }, []);

  // Sets selected category and navigates to products page with the category pre-selected
  const setSelectedCategory = (category) => {
    navigate('/products', { state: { selectedCategory: category } });
  };

  return (
    <div>
      <NavBar /> {/* Navigation bar component */}

      {/* Welcome section with call-to-action */}
      <section className="top-section">
        <div className="top-content">
          <h1>Wear your pride,</h1>
          <h1>Embrace the blue.</h1>
          <p>
            We're thrilled to have you here! Whether you're cheering in the stands or going about your daily routine,
            our gear will keep you connected to the spirit and excellence of NU.
          </p>
          <button onClick={viewallproducts} className="shopnowbtn">Shop Now</button>
        </div>
      </section>

      {/* Notice section */}
      <section>
        <div className="notice-section">
          <p>
            Welcome NU Bulldogs! Take note that there are no deliveries available yet. All orders are to be scheduled for pick-up.
          </p>
        </div>
      </section>

      {/* Features section with three main features */}
      <section className='fullfeature'>
        <div className='features'>
          <div className="feature">
            <div className="feature-content">
              <img src={f1} alt="Product" className="feature-icon" />
              <div className="text-content">
                <h3>Scheduled Pickup Orders</h3>
                <p>Keeps the pickup process organized, preventing overcrowding and long waits.</p>
              </div>
            </div>
          </div>

          <div className="feature">
            <div className="feature-content">
              <img src={f2} alt="Product" className="feature-icon" />
              <div className="text-content">
                <h3>Exclusive for NU MOA Students</h3>
                <p>Exclusively for NU MOA students, who can access the services for orders.</p>
              </div>
            </div>
          </div>

          <div className="feature">
            <div className="feature-content">
              <img src={f3} alt="Product" className="feature-icon" />
              <div className="text-content">
                <h3>Feedback Management</h3>
                <p>Allows students to provide feedback on their experiences or suggestions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "What's New" section showcasing new products, revealed when scrolled into view */}
      <section className={`whatsnew ${isVisible ? 'visible' : ''}`} ref={whatsNewRef}>
        <div className='wntext'>
          <h1>What's new?</h1>
          <h3>NU Tumbler</h3>
          <p>Stay refreshed on the go with our sleek and stylish NU Tumbler! Made from durable, high-quality materials, this eco-friendly tumbler keeps your drinks hot or cold for hours. Show off your NU pride while enjoying your favorite beverages in style!</p>
          <p>Available in color: Blue and Yellow</p>
          <div className="price-container">
            <p>PHP 199</p>
          </div>
        </div>
        <img src={tumbler} alt="NU Tumbler" />
      </section>

      {/* Featured Products section with clickable product cards */}
      <section className="ftrdproducts">
        <h1>Featured Products</h1>

        <div className="product-list">
          {products.map((product) => (
            <div
              className="product-card"
              key={product.id}
              onClick={() => setSelectedCategory(product.category)}
            >
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <h2 className="product-name">{product.name}</h2>
              <p className="product-description">{product.description}</p>
              <span className="price">PHP {product.price}</span>
            </div>
          ))}
        </div>

        <button onClick={viewallproducts} className="viewall">View All</button>
      </section>

      {/* Slideshow component for displaying images */}
      <Slideshow />

      {/* YouTube video section promoting NU MOA */}
      <section className='videonumoa'>
        <div className="video-content-container">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/tq0LMc3aIqY?si=TJB2O46iQNCqE2Iz"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>

          <div className='videodescription'>
            <p>Come and take a peek at NU MOA.</p>
            <p>Are you looking for a campus in Pasay City, near Manila, Paranaque, and Las Pinas, that offers courses like Dentistry, Optometry, Psychology, Information Technology, and Senior High School?</p>
            <p>NU MOA’s state-of-the-art facilities are a testament to NU’s promise to provide quality, affordable, and accessible education.</p>
          </div>
        </div>
      </section>

      {/* Contact section with category selection and feedback page */}
      <ContactSection setSelectedCategory={setSelectedCategory} />
      <FeedbackPage />

      {/* Scroll-to-top button for easy navigation */}
      <ScrollToTopButton />
    </div>
  );
};

export default HomePage;
