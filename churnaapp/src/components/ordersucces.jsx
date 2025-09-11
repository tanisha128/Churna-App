import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import './OrderSuccess.css'; // Import the CSS file

function OrderSuccess() {
  return (
    <div className="order-success">
      <CheckCircle2 className="icon" /> {/* Add the icon */}
      <h1>Order Placed Successfully!</h1>
      <p>Thank you for your purchase. We will deliver your order soon.</p>
    </div>
  );
}

export default OrderSuccess;