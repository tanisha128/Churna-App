import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { useCart } from './CartContext'; 
import { useSearch } from './SearchContext';
import './SearchContext';


export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const { searchResults, setSearchResults } = useSearch(); 
  const { cartCount } = useCart();

   const API_URL = process.env.NODE_ENV === 'production'
  ? '/api/products'
  : 'http://localhost:5000/api/products';

fetch(API_URL)

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 1) {
      fetch(`/api/products?search=${e.target.value}`)
        .then((res) => res.json())
        .then((data) => setSearchResults(data)) 
        .catch((err) => console.error(err));
    } else {
      setSearchResults([]); // reset
    }
  };

  // 👇 function to clear after clicking
  const handleResultClick = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className='navbar'>
      <div className='Logo'>
        <img src='/logo.png' alt='logo' />
      </div>

      <div className='search-bar'>
        <input
          type='text'
          placeholder='Search products...'
          value={searchTerm}
          onChange={handleSearch}
        />
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(product => (
              <Link 
                key={product._id} 
                to={`/product/${product._id}`} 
                onClick={handleResultClick} // ✅ clear search after click
              >
                <div className="result-item">
                  {product.name} - ₹{product.price}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className='nav-icons'>
        <Link to='/admin' className='login'>
          <img
            src='https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg'
            alt='User icon'
          />
        </Link>

        <div className='cart'>
          <Link to="/cart" className="cart-icon">
            <img
              src='https://cdn-icons-png.flaticon.com/512/6445/6445100.png'
              alt='Shopping cart icon'
            />
            
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
