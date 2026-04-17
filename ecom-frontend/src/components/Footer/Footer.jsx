import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <div className="footer-brand">
        <span className="footer-logo">🛒 ShopVibe</span>
        <p>Your premium e-commerce destination for everything you need.</p>
      </div>
      <div className="footer-links">
        <h4>Shop</h4>
        <Link to="/products">All Products</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/wishlist">Wishlist</Link>
      </div>
      <div className="footer-links">
        <h4>Account</h4>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/orders">My Orders</Link>
      </div>
      <div className="footer-links">
        <h4>Support</h4>
        <a href="#">Help Center</a>
        <a href="#">Contact Us</a>
        <a href="#">Returns</a>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} ShopVibe. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
