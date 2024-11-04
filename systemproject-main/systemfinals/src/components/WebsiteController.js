import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoadingPage from './LoadingPage';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import HomePage from './HomePage';
import ProductsPage from './ProductsPage';
import AccountPage from './AccountPage';
import Cart from './CartPage';
import ScrollToTop from './ScrollToTop';

// Main component for managing the website's routing
const WebsiteController = () => {
  return (
    // Router component to enable routing within the app
    <Router>
      {/* ScrollToTop component ensures the page scrolls to the top when navigating to a new route */}
      <ScrollToTop />
      {/* Define the routes for different pages */}
      <Routes>
        {/* Route for the loading page */}
        <Route path="/" element={<LoadingPage />} />

        {/* Route for the login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Route for the sign-up page */}
        <Route path="/signup" element={<SignUpPage />} />

        {/* Route for the home page */}
        <Route path="/home" element={<HomePage />} />

        {/* Route for the products page */}
        <Route path="/products" element={<ProductsPage />} />

        {/* Route for the account page */}
        <Route path="/account" element={<AccountPage />} />

        {/* Route for the cart page */}
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default WebsiteController;
