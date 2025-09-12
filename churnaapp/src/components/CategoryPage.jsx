import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CategoryPage.css";
import { useCart } from "./CartContext";

export default function CategoryPage() {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
   const API_URL = process.env.NODE_ENV === 'production'
  ? '/api/products'
  : 'http://localhost:5000/api/products';

fetch(API_URL)

  useEffect(() => {
    fetch(`/api/products/category/${name}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, [name]);

  return (
    <div>
      <h2 className="category-title">{name.toUpperCase()}</h2>

      <div className="product">
        {products.map((p) => (
          <div key={p._id} className="product-card">
            <img src={p.image_url} alt={p.name} />
            <h3>{p.name}</h3>
            <p className="price">₹{p.price}</p>

            <button
              className="add-btn"
              onClick={() => {
                addToCart({
                  id: p._id,
                  name: p.name,
                  price: p.price,
                  img: p.image_url // Ensure img property is included
                });
                console.log(`Added to cart: ${p.name} with image URL: ${p.image_url}`);
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


