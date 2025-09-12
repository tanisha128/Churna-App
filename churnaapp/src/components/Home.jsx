import React, { useEffect } from 'react';
import { useCart } from '../components/CartContext';
import './home.css';
import { useState } from 'react';
import { useSearch } from './SearchContext';

const carouselProducts = [
  { id: 1, name: 'Its not only Medicinal use... Its also use for Healthy Health', img: 'https://static.vecteezy.com/system/resources/previews/027/688/162/non_2x/spices-and-herbs-on-top-of-wooden-table-free-photo.jpg '},
  { id: 2, name: 'Its not only Medicinal use... Its also use for Healthy Health', img: 'https://www.healthkart.com/connect/wp-content/uploads/2022/10/900x500_thumbnail_HK-triphala-benefits.png '},
  { id: 3, name: 'Its not only Medicinal use... Its also use for Healthy Health', img: 'https://images.onlymyhealth.com/imported/images/2023/January/27_Jan_2023/triphala-churna-benefits-main.jpg '},
  { id: 4, name: 'Its not only Medicinal use... Its also use for Healthy Health', img: 'https://dwibhashi.co.in/cdn/shop/articles/Triphala_Churna.jpg?v=1738755886'},
];

const ProductCard = ({ product, addToCart }) => {
 let imageSrc = product.image_url || product.image || product.img || null;


 // If it's a local path, prepend backend server URL
if (imageSrc && !imageSrc.startsWith("http")) {
  imageSrc = imageSrc.startsWith("/") ? imageSrc : `/${imageSrc}`;
}

   const outOfStock = product.stock === 0;

  return (
    <div className='product-card'>
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

   {/* Out of Stock Badge */}
      {outOfStock && (
        <span className="out-of-stock-badge">
          Out of Stock
        </span>
      )}

      <h3>{product.name}</h3>
      <p className="description">{product.description}</p> 
      <p className='price'>₹{product.price}</p>
       <button
        onClick={() => addToCart(product)}
        className="add-btn"
        disabled={outOfStock}
      >
        {outOfStock ? "Unavailable" : "Add to Cart"}
      </button>
    </div>
  );
};



export default function Home() {
  const { addToCart, message, clearMessage } = useCart();
  const [index, setIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const { searchResults } = useSearch();

  useEffect(() => {
    if (searchResults.length === 0) {
      // fetch all products only if not searching
      fetch("/api/products")
        .then((res) => res.json())
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

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage();
      }, 3000); // Clear the message after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message, clearMessage]);

  return (
    <div className='hero'>
  <div className='hero-section'>
    {carouselProducts.map((c, i) => (
      <div key={c.id} className={`hero-slide ${i === index ? 'active' : ''}`}>
        <img src={c.img} alt={c.name} />
      </div>
    ))}
  </div>

  {/* ✅ Fixed caption below carousel */}
  <div className='hero-caption-below'>
    <h2>Its not only Medicinal use... Its also use for Healthy Health</h2>
  </div>



      

  
<div className="product">
  <h1>Our Products</h1>
  {(searchResults.length > 0 ? searchResults : products).map((p) => (
    <ProductCard key={p._id} product={p} addToCart={addToCart} />
  ))}
</div>


      {message && <div className="message">{message}</div>}
    </div>
  );
}