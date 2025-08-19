import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'
const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section about">
          <h1 className="logo-text">CarForSale</h1>
          <p>
            India's leading platform for buying and selling certified pre-owned cars with trust and transparency.
          </p>
          {/* Add social icons here later */}
        </div>
        <div className="footer-section links">
          <h2>Quick Links</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/buy">Buy Car</Link></li>
          </ul>
        </div>
        <div className="footer-section contact-form">
          <h2>Contact Us</h2>
          {/* <input type="email" name="email" className="text-input contact-input" placeholder="Your email address..." />
          <textarea name="message" className="text-input contact-input" placeholder="Your message..."></textarea>
          <button type="submit" className="btn btn-primary">Send</button> */}
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} CarForSale | Designed by Sahil
      </div>
    </footer>
  );
};

export default Footer;