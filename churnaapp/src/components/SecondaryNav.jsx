import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './secondaryNav.css';

const categories = ['Seeds', 'Powders', 'Oils', 'Honey'];

export default function SecondaryNav() {
  const navigate = useNavigate();

  const handleCategoryClick = (cat) => {
    navigate(`/category/${cat.toLowerCase()}`);
  };

  return (
    <div>
      <div className="secondary-navbar">
        <div className="nav-links">
          <Link to="/" className="nav-link">HOME</Link>
          <span className="nav-title">SEARCH BY CATEGORY</span>
          <Link to="/contact" className="nav-link">CONTACT US</Link>
        </div>
      </div>

      <div className="category-list">
        {categories.map((cat) => (
          <button
            key={cat}
            className="category-option"
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
