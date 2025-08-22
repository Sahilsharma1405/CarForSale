import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
// --- START: Import icons ---
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope } from 'react-icons/fa';
// --- END: Import icons ---

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section about">
          <h1 className="logo-text">CarForSale</h1>
          <p>
            India's leading platform for buying and selling certified pre-owned cars with trust and transparency.
          </p>
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
          <div className="contact">
            <span><FaPhone /> &nbsp; +91 63522 36484</span>
            <span><FaEnvelope /> &nbsp; <a href="mailto:semprojectdemo4@gmail.com">semprojectdemo4@gmail.com</a></span>
          </div>
          <div className="socials">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} CarForSale | Designed by Sahil
      </div>
    </footer>
  );
};

export default Footer;