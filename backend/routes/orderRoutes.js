const express = require("express");
const router = express.Router();
const Order = require("../model/order.js");   
const Product = require("../model/product.js");
const sendMail = require("../utils/email.js"); 

//-----------------------------------------------------------
// Create order 
//-----------------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const { customer, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Order must have at least one item" });
    }

    // ✅ sanitize items
    const cleanItems = items.map((it) => ({
      ...it,
      price: Number(it.price) || 0,
      qty: Number(it.qty) || 1,
    }));

    const total = cleanItems.reduce((s, it) => s + it.price * it.qty, 0);

    const order = await Order.create({ customer, items: cleanItems, total });

    // Email content
    const lines = cleanItems
      .map((it) => `• ${it.name} × ${it.qty} — ₹${it.price}`)
      .join("\n");

    const orderText = `
Order ID: ${order._id}
Customer: ${customer.name} (${customer.email})
Phone: ${customer.phone}
Address: ${customer.address}
Total: ₹${total}

Items:
${lines}
    `;

    // Send email to Admin
    await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: `🛒 New Order #${order._id}`,
      text: orderText,
    });

    // Send email to Customer
    await sendMail({
      to: customer.email,
      subject: `✅ Your Order Confirmation (#${order._id})`,
      text: `Hello ${customer.name},\n\nThank you for your order!\n\n${orderText}\n\nWe will deliver your order soon.\n\n– Oxyjain Herbal Care`,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: err.message });
  }
});

//-----------------------------------------------------------
// Admin – list orders
//-----------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const list = await Order.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("Order fetch error:", err.message);
    res.status(500).json({ error: "Server error while fetching orders" });
  }
});

//-----------------------------------------------------------
// DELETE order by ID
//-----------------------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//-----------------------------------------------------------
// PUT - Update order status + stock adjustment
//-----------------------------------------------------------
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!['placed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ If moving to delivered & wasn't delivered before → reduce stock
    if (status === "delivered" && order.status !== "delivered") {
      for (let item of order.items) {
        const product = await Product.findById(item.product._id);
        if (product) {
          product.stock = Math.max(0, product.stock - item.qty); // prevent negative stock
          await product.save();
        }
      }
    }

    // ✅ Update order status
    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error("Error updating status:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
