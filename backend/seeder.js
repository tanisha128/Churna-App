const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./model/product");  // Ensure the path is correct

// Connect to MongoDB
mongoose.connect(process.env.URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

const results = [];

fs.createReadStream("product.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", async () => {
    console.log("📄 Parsed CSV rows:", results);  // 👈 Add this

    const validProducts = [];
    const skipped = [];

    results.forEach(p => {
      if (p.name && p.price) {
        validProducts.push({
          name: p.name.trim(),
          price: Number(p.price.replace(/[^0-9.-]+/g, "")), // ✅ remove ₹ or $
          description: p.description ? p.description.trim() : "",
          img: p.img ? p.img.trim() : ""
        });
      } else {
        skipped.push(p);
      }
    });

    if (skipped.length > 0) {
      console.log("⚠️ Skipped rows:", skipped);
    }

    if (validProducts.length === 0) {
      console.log("⚠️ No valid products found in CSV.");
      process.exit();
    }

    await Product.insertMany(validProducts);
    console.log(`✅ ${validProducts.length} products inserted successfully!`);
    process.exit();
  });
