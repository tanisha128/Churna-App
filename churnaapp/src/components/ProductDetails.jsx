// src/components/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "./CartContext";
import './productdetails.css';



export default function ProductDetail() {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [productId]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  let imageSrc = product.image_url || product.image;
  if (imageSrc && !imageSrc.startsWith("http")) {
    imageSrc = `http://localhost:5000${imageSrc}`;
  }

  return (
    <div className="product-detail">
      <img
        src={imageSrc || "/default.png"}
        alt={product.name}
        onError={(e) => (e.target.src = "/default.png")}
      />
      <div className="detail-info">
        <h2>{product.name}</h2>
        <p className="price">₹{product.price}</p>
        <p className="description">{product.description || "No description available."}</p>
        <button onClick={() => addToCart(product)} className="add-btn">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
