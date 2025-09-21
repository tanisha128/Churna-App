// src/components/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "./CartContext";
import "./productdetails.css";
import { API_URL } from "./config";

export default function ProductDetail() {
  const { id, productId } = useParams(); // supports both param names
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const pid = productId || id; // fallback if one is missing

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

  // Handle image
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

  // Convert benefits string into an array (if present)
const cleanBenefits = product.benefits
  ? product.benefits
      .replace(/\r\n/g, "\n")      // normalize Windows
      .replace(/\r/g, "\n")        // normalize Mac
      .replace(/\u2028|\u200B/g, "") // remove hidden breaks (unicode line sep, zero-width space)
    
       .replace(/(\S)\n(\S)/g, "$1$2") 
  : "";

 

  return (
   <div className="product-detail">
  <div>
    <img src={imageSrc || "/default.png"} alt={product.name} />
    <div className="detail-info">
      <h2>{product.name}</h2>
      <p className="price">₹{product.price}</p>
      <p className="description">{product.description || "No description available."}</p>
      <button onClick={() => addToCart(product)} className="add-button">
        Add to Cart
      </button>
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