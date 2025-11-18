import { Link } from 'react-router-dom';
import './navbar.css';
import { useCart } from './CartContext';
import { useSearch } from './SearchContext';
import { API_URL } from './config';
import React, { useState, useRef, useEffect } from 'react';


export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const { searchResults, setSearchResults } = useSearch();
  const { cartCount } = useCart();
  const searchRef = useRef(null);


const handleSearch = (e) => {
  const value = e.target.value.toLowerCase();
  setSearchTerm(value);

  if (value.trim() === "") {
    setSearchResults([]);
    return;
  }

  fetch(`${API_URL}/products`)
    .then((res) => res.json())
    .then((allProducts) => {
      const filtered = allProducts
        .filter((p) =>
          (p.name || "").toLowerCase().startsWith(value)
        )
        .sort((a, b) => a.name.localeCompare(b.name)); // <-- SORT HERE

      setSearchResults(filtered);
    })
    .catch((err) => console.error(err));
};


  const handleResultClick = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  useEffect(() => {
  function handleClickOutside(event) {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSearchTerm("");
      setSearchResults([]);  // close dropdown
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [setSearchResults]);


  return (
    <div className='navbar'>
      <div className='Logo'>
        <img src='/logoo.png' alt='logo' />
        <img src='/logo2.png' alt='logo2' />
      </div>

      <div className='search-bar' ref={searchRef}>

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
          <img src='https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg' alt='User icon' />
        </Link>

        <div className='cart'>
          <Link to="/cart" className="cart-icon">
            <img src='https://cdn-icons-png.flaticon.com/512/6445/6445100.png' alt='Shopping cart icon' />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </div>
  );
}


