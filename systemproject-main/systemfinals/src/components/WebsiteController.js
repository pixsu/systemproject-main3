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

const WebsiteController = () => {
  return (
    <Router>
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<LoadingPage />} /> 
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/signup" element={<SignUpPage />} /> 
        <Route path="/home" element={<HomePage />} /> 
        <Route path="/products" element={<ProductsPage />} /> 
        <Route path="/account" element={<AccountPage />} /> 
        <Route path="/cart" element={<Cart />} /> 
      </Routes>
    </Router>
  );
}

export default WebsiteController;
