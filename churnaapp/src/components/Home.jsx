import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import './home.css';
import './product.css'
import { useState } from 'react';
import { useSearch } from './SearchContext';
import { API_URL} from './config';

const carouselProducts = [
  { id:1, name:'Its not only Medicinal use... Its also use for Healthy Health', img:'https://static.vecteezy.com/system/resources/previews/027/688/162/non_2x/spices-and-herbs-on-top-of-wooden-table-free-photo.jpg'},
  { id:2, name:'Its not only Medicinal use... Its also use for Healthy Health', img:'https://www.healthkart.com/connect/wp-content/uploads/2022/10/900x500_thumbnail_HK-triphala-benefits.png'},
  { id:3, name:'Its not only Medicinal use... Its also use for Healthy Health', img:'https://images.onlymyhealth.com/imported/images/2023/January/27_Jan_2023/triphala-churna-benefits-main.jpg'},
  { id:4, name:'Its not only Medicinal use... Its also use for Healthy Health', img:'https://dwibhashi.co.in/cdn/shop/articles/Triphala_Churna.jpg?v=1738755886'},
];

const ProductCard = ({ product }) => {
  let imageSrc = product.image_url || product.image || product.img || null;

  // For relative URLs, prepend backend base path
  if (imageSrc && !imageSrc.startsWith("http")) {
    imageSrc = `${BASE_URL}${imageSrc.startsWith("/") ? "" : "/"}${imageSrc}`;
  }

  return (
    <div className="product-card">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default.png";
          }}
        />
      ) : (
        <img src="/default.png" alt="default product" />
      )}

      <Link to={`/product/${product._id}`}>
        <h3>{product.name}</h3>
      </Link>
      <p className="description">{product.description}</p>
      <p className="price">₹{product.price}</p>

      <Link to={`/product/${product._id}`}>
        <button className="add">View Benefits</button>
      </Link>
    </div>
  );
};

export default function Home() {
  const [index, setIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const { searchResults } = useSearch();

  useEffect(() => {
    const url = `${API_URL}/products`;
    if (searchResults.length === 0) {
      fetch(url)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => setProducts(data))
        .catch((err) => console.error("Fetch error:", err));
    } else {
      setProducts(searchResults);
    }
  }, [searchResults]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % carouselProducts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero">
      <div className="hero-section">
        {carouselProducts.map((c, i) => (
          <div
            key={c.id}
            className={`hero-slide ${i === index ? "active" : ""}`}
          >
            <img src={c.img} alt={c.name} />
          </div>
        ))}
      </div>

      <div className="hero-caption-below">
        <h2>Its not only Medicinal use... Its also use for Healthy Health</h2>
      </div>

      <div className="product">
        <h1>Our Products</h1>
        {products.map((p) => (
          <ProductCard key={p._id || p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
