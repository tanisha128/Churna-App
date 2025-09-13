import React, { useState } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import API from "./api";
import './Order.css'; 

export default function Order() {
  const { cartItems, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.price.toString().replace("₹", "")) * (item.qty || 1),
    0
  );

  const navigate = useNavigate();

  const placeOrder = async () => {
    if (!customerName || !customerEmail || !address || !phone) {
      alert("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      customer: {
        name: customerName,
        email: customerEmail,
        address,
        phone,
      },
      items: cartItems.map((it) => {
        const cleanPrice = Number(it.price?.toString().replace("₹", "")) || 0;
        const cleanQty = Number(it.qty) || 1;

        return {
          product: it._id || it.id, 
          name: it.name,
          price: cleanPrice,
          image_url: it.image,
          qty: cleanQty,
        };
      }),
      total: totalAmount,
    };

    try {
      const response = await API.orders.create(orderData);
      clearCart(); // ✅ empty cart after success
      navigate("/ordersuccess");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-page">
      <h1>Confirm Your Order</h1>

      <div className="text-fields">
        <input
          type="text"
          placeholder="Full Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        <ul>
          {cartItems.map((item) => (
            <li key={item._id || item.id}>
              <div>
                {item.name} × {item.qty}
              </div>
              <div>
                ₹{Number(item.price.toString().replace("₹", "")) * (item.qty || 1)}
              </div>
            </li>
          ))}
        </ul>
        <p className="total">Total: ₹{totalAmount.toFixed(2)}</p>
      </div>

      <div className="payment">
        <p>Payment Option:</p>
        <label>
          <input type="radio" checked readOnly /> Cash on Delivery
        </label>
      </div>

      <button
        onClick={placeOrder}
        className="confirm-order-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Placing Order..." : "Confirm Order"}
      </button>
    </div>
  );
}