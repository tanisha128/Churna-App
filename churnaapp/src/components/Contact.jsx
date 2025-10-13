import React, { useState } from 'react';
import './contact.css';
import { API_URL } from './config';

export default function Contact() {
 
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
     const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName || '', 
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

  <span className="number" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    +91-9822972555
    <a
      href="https://wa.me/919822972555"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        backgroundColor: "#25D366", // WhatsApp green
      }}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        width="18"
        height="18"
      />
    </a>
  </span>
 <br />

  <span className='number' style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    +91-9156033505
    <a
      href="https://wa.me/919156033505"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        backgroundColor: "#25D366",
      }}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        width="18"
        height="18"
      />
    </a>
  </span>
</li>

            <li>
              <strong>Email us</strong>
              <br />
              <span>ashamohanpune@gmail.com</span>
             
            </li>
            <li>
              <strong>Visit us</strong>
            <br />

  Ashamohan Enterprises, 343 Shaniwar Peth, City Icon Building, Near English Medium School, Pune-30

<br />

              <div className="map-wrapper"> <iframe title="Google Map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.8276617819954!2d73.84614731535197!3d18.5178055874045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c07d7f2a2f5f%3A0x8a62f2f0370f4953!2s18%C2%B031'04.1%22N%2073%C2%B050'55.4%22E!5e0!3m2!1sen!2sin!4v1727354789000!5m2!1sen!2sin" width="100%" height="300" style={{ border: 0, borderRadius: 12 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" ></iframe> </div>
            </li>
          </ul>
        </div>

        <div className="hero-image">
          <img src="https://img.freepik.com/premium-photo/indian-ayurvedic-triphala-churan-trifala-powder-is-ancient-medicine-bowel-movement-indigestion-problems-selective-focus_466689-26671.jpg" alt="Contact illustration" />
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