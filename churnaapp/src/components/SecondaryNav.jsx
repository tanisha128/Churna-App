import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './secondaryNav.css';

const categories = [
  'Seeds',
  'Powders',
  'Oils'
];

export default function SecondaryNav() {
  const [open, setOpen] = useState(null);

  const toggle = (key) => () => setOpen(open === key ? null : key);

  const closeAll = () => setOpen(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the click was outside the dropdown menu
      if (!event.target.closest('.dropdown')) {
        closeAll();
      }
    };

    // Add the event listener when the component mounts
    document.addEventListener('click', handleOutsideClick);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className="secondary-navbar">
      <div className="dropdown">
        <button
          className="nav-link category-btn"
          onClick={toggle('cat')}>
          SHOP BY CATEGORY ▾
        </button>
        {open === 'cat' && (
          <ul className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
            {categories.map((cat) => (
              <li key={cat}>
                <Link to={`/category/${cat.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => closeAll()}>
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link to="/" className='nav-link'>HOME</Link>
      <Link to="/contact" className="nav-link">CONTACT US</Link>
    </div>
  );
}