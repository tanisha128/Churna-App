const mongoose = require('mongoose');
const productSchema = new mongoose.Schema(
{
name: { type: String, required: true },
description: String,
price: { type: Number, required: true },
image_url: String,
category: String,
stock: { type: Number, default: 0 },
benefits: { type:String, default: '[]' }
},
{ timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
