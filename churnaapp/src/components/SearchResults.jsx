import React from 'react';
import { Link } from 'react-router-dom';

export default function SearchResults({ results }) {
  return (
    <div className="search-results">
      {results.map(product => (
        <Link key={product._id} to={`/product/${product._id}`}>
          <div className="result-item">
            {product.name} - ₹{product.price}
          </div>
        </Link>
      ))}
    </div>
  );
}