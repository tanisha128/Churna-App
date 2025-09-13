import React, { useState, useEffect } from 'react';
import API from './api';
import './adminDash.css';

export default function OrdersDashboard() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const data = await API.orders.list();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error("Invalid response for orders:", data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await API.orders.delete(id);  
      if (res && !res.error) {
        setOrders(orders.filter((o) => o._id !== id));
      } else {
        alert("❌ Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await API.orders.updateStatus(orderId, newStatus);
      setOrders(orders.map(o => 
        o._id === orderId ? { ...o, ...updated } : o
      ));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="order">
      <h1>Orders Dashboard</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {order.customer?.name || "Unknown"} <br />
                  {order.customer?.email || "—"} <br />
                  {order.customer?.address || "—"} <br />
                  {order.customer?.phone || "—"}
                </td>
                <td>
                  {(order.items || []).map((item) => (
                    <div key={item._id || item.name}>
                      {item?.name || "Unnamed"} × {item?.qty || 1}
                    </div>
                  ))}
                </td>
                <td>₹{typeof order.total === "number" ? order.total.toFixed(2) : "0.00"}</td>
                
                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className={`status-dropdown ${String(order.status).replace(/[^a-z0-9_-]/gi, '').toLowerCase()}`}
                  >
                    <option value="placed">Placed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered ✅</option>
                    <option value="cancelled">Cancelled ❌</option>
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleDeleteOrder(order._id)}
                    className="btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
