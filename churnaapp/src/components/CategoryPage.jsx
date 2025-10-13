import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./CategoryPage.css";
import { API_URL } from "./config";

export default function CategoryPage() {
  const { name } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/products/category/${name}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Fetch error:", err));
  }, [name]);

  return (
    <div>
      <h2 className="category-title">{name.toUpperCase()}</h2>
      <div className="product">
        {products.map((p) => (
          <div key={p._id} className="product-card">
            <img src={p.image_url} alt={p.name} />
            <h3>{p.name}</h3>
            <p className="description">{p.description}</p>
            <p className="price">₹{p.price}</p>
            <Link to={`/product/${p._id}`}>
              <button className="add-btn">View Benefits</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}


