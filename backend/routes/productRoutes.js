const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const { auth, isAdmin } = require('../middleware/auth');
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Local disk configure
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../pictures"); // local folder
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const localUpload = multer({ storage: localStorage });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products", 
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const cloudUpload = multer({ storage });

// ===============================
// Public Routes
// ===============================

// Get all products (with optional search)
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    const products = await Product.find({
      name: { $regex: search, $options: "i" } 
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get products by category
router.get("/category/:categoryName", async (req, res) => {
  try {
    const { categoryName } = req.params;
    const products = await Product.find({
      category: new RegExp("^" + categoryName + "$", "i") // case-insensitive
    });
    res.json(products);
  } catch (err) {
    console.error("Error fetching products by category:", err);
    res.status(500).json({ message: err.message });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ message: err.message });
  }
});    


// navabr search product
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";

    let query = {};

    // Check if search looks like a MongoDB ObjectId (24 hex chars)
    if (/^[0-9a-fA-F]{24}$/.test(search)) {
      query = { _id: search }; // search by ID
    } else {
      query = { name: { $regex: search, $options: "i" } }; // search by name
    }

    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: error.message });
  }
});


// Upload images to local
router.put("/:id/image/local", auth, isAdmin, localUpload.single("image"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.file) {
      product.image_url = `${req.protocol}://${req.get("host")}/pictures/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: "No file uploaded" });
    }

    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Local upload error:", error);
    res.status(500).json({ message: "Local upload error", error });
  }
});


// Upload images to cloud
router.post("/:id/image/cloud", auth, isAdmin, cloudUpload.single("image"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.image_url = req.file.path; 
    await product.save();

    res.json(product);
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: "Cloudinary upload error", error });
  }
});

// ===============================
// Admin Routes (protected)
// ===============================

// Create product (admin only)
router.post("/", auth, isAdmin, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: 'Server Error', error });
  }
});


// ===============================
// Update product(admin only)
router.put("/:id", auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;
    product.stock = req.body.stock || product.stock;
    product.description = req.body.description || product.description;

    if (req.file) { // Check if a file was uploaded
      product.image_url = `/pictures/${req.file.filename}`;
    }

    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// Delete product(admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;




