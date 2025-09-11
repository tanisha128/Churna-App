const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema(
{
customer: {
name: String,
email: String,
address: String,
phone: String
},
items: [
{
product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
name: String,
price: Number,
image_url: String,
qty: { type: Number, default: 1 }
}
],
total: Number,
status: { type: String, enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'placed' }
},
{ timestamps: true }
);


const Order = mongoose.model('Order', orderSchema);
module.exports = Order; 