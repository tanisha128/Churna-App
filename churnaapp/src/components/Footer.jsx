import React from 'react'
import './footer.css'

export default function Footer() {
  return (
    <footer className="footer">
    <div className='footer-top'>
        <div className='footer-col'>
            <h4>Churna App</h4>
            <p>Authentic Ayurveda, delivered to your doorstep.</p>
        </div>
        <div className='footer-col'>
            <h4>Quick Links</h4>
            <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/category/seeds">Shop</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact Us</h4>
          <p>Call&nbsp;:&nbsp;<a href="tel:+919929561904">+91 99295 61904</a></p>
           <p>Email&nbsp;:&nbsp;<a href="mailto:support@churna.com">support@churna.com</a></p>
        </div>
        <div className='footer-col'>
            <h4>Follow Us</h4>
            <div className='social'>
            <a href="https://facebook.com"><img src = 'https://1.bp.blogspot.com/-S8HTBQqmfcs/XN0ACIRD9PI/AAAAAAAAAlo/FLhccuLdMfIFLhocRjWqsr9cVGdTN_8sgCPcBGAYYCw/s1600/f_logo_RGB-Blue_1024.png'/></a>
            <a href="https://instagram.com"><img src='https://freepngimg.com/download/logo/69768-logo-computer-layout-instagram-icons-png-file-hd.png'/></a>
            <a href="https://twitter.com"><img src='https://icons.veryicon.com/png/Phone/iOS7%20Style/Twitter.png'/></a>
            
        </div>
     </div>
           <div className="footer-bottom">
        © {new Date().getFullYear()} Churna App. All rights reserved.
      </div>
      
    </div>
    </footer>
  )
}
