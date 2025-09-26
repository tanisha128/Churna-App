// src/components/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "./CartContext";
import "./productdetails.css";
import { API_URL } from "./config";

export default function ProductDetail() {
  const { id, productId } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState(""); // ✅ message state

  const pid = productId || id;

  useEffect(() => {
    if (!pid) return;
    fetch(`${API_URL}/products/${pid}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [pid]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  let imageSrc = product.image_url || product.image;
  if (imageSrc && !imageSrc.startsWith("http")) {
    imageSrc = `${imageSrc}`;
  }

  function cleanDevanagari(text = "") {
    return text
      .normalize("NFC")
      .replace(/\u200B/g, "")
      .replace(/\u200C/g, "")
      .replace(/\u200D/g, "")
      .replace(/\u2028/g, "")
      .replace(/\u00AD/g, "")
      .replace(/\uFEFF/g, "");
  }

  const cleanBenefits = product.benefits
    ? product.benefits
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/\u2028|\u200B/g, "")
        .replace(/(\S)\n(\S)/g, "$1$2")
    : "";

  const outOfStock = !product.stock || product.stock === 0;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...product, qty: quantity });
    setMessage("✅ Item added to cart successfully!"); // show success message
    setTimeout(() => setMessage(""), 3000); // auto-hide after 3s
  };

  return (
    <div className="product-detail">
      <div>
        <img src={imageSrc || "/default.png"} alt={product.name} />
        <div className="detail-info">
          <h2>{product.name}</h2>
          <p className="description">
            {product.description || "No description available."}
          </p>
          <p className="price">₹{product.price}</p>

          {/* Quantity Selector */}
          <div className="quantity-selector">
            <button
              onClick={handleDecrement}
              className="quantity-btn"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="quantity-value">{quantity}</span>
            <button
              onClick={handleIncrement}
              className="quantity-btn"
              disabled={quantity >= product.stock}
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="add-button"
            disabled={outOfStock}
          >
            {outOfStock ? "Unavailable" : "Add to Cart"}
          </button>

          {/* ✅ Success message */}
          {message && <p className="success-message">{message}</p>}
        </div>
      </div>

      {cleanBenefits && (
        <div className="benefits">
          <h3>Benefits:</h3>
          <p style={{ whiteSpace: "pre-line" }}>
            {cleanDevanagari(product.benefits)}
          </p>
        </div>
      )}
    </div>
  );
}
