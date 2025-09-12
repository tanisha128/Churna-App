import React, { useState } from 'react';
import './contact.css';

export default function Contact() {
   const API_URL = process.env.NODE_ENV === 'production'
  ? '/api/contact'
  : 'http://localhost:5000/api/contact';

fetch(API_URL)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName || '', // Ensure lastName is included, even if empty
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        subject: formData.subject,
        message: formData.message
      })
    });

    const data = await response.json(); // Parse the JSON response
    if (response.ok) {
      alert(data.message);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        subject: '',
        message: ''
      });
    } else {
      alert(data.error || 'Failed to send message');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Server error');
  }
};

  return (
    <div className="contact">
      <div className="contact-hero">
        <div className="hero-text">
          <h1>Contact Us</h1>
          <p>
            Feel free to reach out to us with any questions, feedback, or concerns.
          </p>
          <ul className="contact-list">
            <li>
              <strong>Call us</strong>
              <br />
              <span>+91-9850604467</span>
              <br />
              <span>+91-6789896434</span>
            </li>
            <li>
              <strong>Email us</strong>
              <br />
              <span>support@ayurveda.com</span>
              <br />
              <span>contact@ayurveda.com</span>
            </li>
            <li>
              <strong>Visit us</strong>
              <br />
              Shop no.3 akshay complex, warje highway, pune, maharshtra,411058
              <br />
              <div className="map-wrapper">
                <iframe
                  title="Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215676!2d-74.0060!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjAiTiA3NMKwMDAnMjEuNiJX!5e0!3m2!1sen!2sus!4v1650000000000"
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: 12 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </li>
          </ul>
        </div>

        <div className="hero-image">
          <img src="https://www.netmeds.com/images/cms/wysiwyg/blog/2019/08/Abhayarishtam_Benefits_big_898_5.jpg" alt="Contact illustration" />
        </div>
      </div>

      {/* Form */}
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="double-input">
          <input
            type="text"
            placeholder="First Name & Last Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="tel"
          placeholder="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <textarea
          placeholder="Your message…"
          rows="4"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}