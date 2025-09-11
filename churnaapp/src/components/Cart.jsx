import { Link } from "react-router-dom";
import "./cart.css";
import { useCart } from "./CartContext";

export default function Cart() {
  const { cartItems, cartCount, removeFromCart } = useCart();

  const parsePrice = (price) => {
    if (typeof price === "string") {
      return Number(price.replace("₹", ""));
    }
    return Number(price);
  };

  const total = cartItems.reduce((sum, p) => {
    const price = parsePrice(p.price);
    const qty = Number(p.qty) || 1;
    return sum + price * qty;
  }, 0);

  return (
    <div className="cart-page">
      <h1>Your Cart ({cartCount})</h1>

      {cartItems.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/">Continue shopping</Link>
        </p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <div key={item._id || item.id} className="cart-item">
                <img 
  src={item.image || item.img || item.image_url } 
  alt={item.name} 
/>
                <div>
                  <h4>{item.name}</h4>
                  <p>
                    {item.qty} × {item.price}
                  </p>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <h3>Total: ₹{total.toFixed(2)}</h3>
            <Link to="/order" className="checkout-btn">
              Place Order
            </Link>
          </div>
        </>
      )}
    </div>
  );
}