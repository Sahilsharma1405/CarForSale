import React,{useState} from 'react';
import './Contact.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const [formData,setFormData]=useState({name:'',email:'',message:''})
  const navigate=useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/contact/', formData);
      alert('Thank you for your message! We will get back to you soon.');
      navigate('/'); // Redirect to homepage on success
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Please fill out the form below or reach out to us directly.</p>
      </div>

      <div className="contact-main">
        <div className="contact-info">
          <h3>Our Office</h3>
          <p>LJ University sarkhej, Ahmedabad, Gujarat, India</p>
          <p><strong>Phone:</strong> +91 63522 36484</p>
          <p><strong>Email:</strong> semprojectdemo4@gmail.com</p>
          
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.970726569803!2d72.49029207476913!3d22.988103917614673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9b0f57f45edf%3A0x371e4963c483ec2d!2sLJ%20UNIVERSITY!5e0!3m2!1sen!2sin!4v1754977322798!5m2!1sen!2sin"
              width="100%" 
              height="250" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Our Location"
            ></iframe>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>Send us a Message</h3>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" onChange={handleChange} value={formData.name} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" required onChange={handleChange} value={formData.email}/>
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="6" className='text-area'  onChange={handleChange} value={formData.message} required></textarea>
          </div>
          <button type="submit" className="form-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;