import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { useCart } from './CartContext'; 
import { useSearch } from './SearchContext';
import './SearchContext';
import { API_URL } from './config';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const { searchResults, setSearchResults } = useSearch(); 
  const { cartCount } = useCart();



  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 1) {
      fetch(`${API_URL}/products?search=${e.target.value}`)
        .then((res) => res.json())
        .then((data) => setSearchResults(data)) 
        .catch((err) => console.error(err));
    } else {
      setSearchResults([]); // reset
    }
  };

  
  const handleResultClick = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className='navbar'>
      <div className='Logo'>
        <img src='/logoo.png' alt='logo' />
         <img src='/logo2.png' alt='logo2' />
        
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
                onClick={handleResultClick} 
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
