import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CategoryPage.css";
import { useCart } from "./CartContext";
import { API_URL } from "./config";

export default function CategoryPage() {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const [showMsg, setShowMsg] = useState(false);

  // Store quantities for all products in an object
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/products/category/${name}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);

        // initialize quantity=1 for each product
        const initialQuantities = {};
        data.forEach((p) => {
          initialQuantities[p._id] = 1;
        });
        setQuantities(initialQuantities);
      })
      .catch((err) => console.error(err));
  }, [name]);

  const handleIncrement = (id, stock) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.min(prev[id] + 1, stock),
    }));
  };

  const handleDecrement = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(prev[id] - 1, 1),
    }));
  };

  const handleAddToCart = (p) => {
    addToCart({ ...p, id: p._id, qty: quantities[p._id] });
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 2000);
  };

  return (
    <div>
      <h2 className="category-title">{name.toUpperCase()}</h2>
      {showMsg && (
        <div className="cart-message-badge">Product added to cart!</div>
      )}
      <div className="product">
        {products.map((p) => {
          const outOfStock = p.stock === 0;
          const quantity = quantities[p._id] || 1;

          return (
            <div key={p._id} className="product-card">
              <img src={p.image_url} alt={p.name} />
              <h3>{p.name}</h3>
              <p className="description">{p.description}</p>
              <p className="price">₹{p.price}</p>

              {/* Quantity Selector */}
              <div className="quantity-selector">
                <button
                  onClick={() => handleDecrement(p._id)}
                  className="quantity-btn"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  onClick={() => handleIncrement(p._id, p.stock)}
                  className="quantity-btn"
                  disabled={quantity >= p.stock}
                >
                  +
                </button>
              </div>

              <button
                className="add-btn"
                onClick={() => handleAddToCart(p)}
                disabled={outOfStock}
              >
                {outOfStock ? "Unavailable" : "Add to Cart"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}


