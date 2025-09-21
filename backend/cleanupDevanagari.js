// cleanupDevanagari.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Product = require("./model/product"); // adjust path if needed

// Cleaning function
function cleanDevanagari(text = "") {
  return text
    .normalize("NFC")
    .replace(/\u200B/g, "") // zero-width space
    .replace(/\u200C/g, "") // zero-width non-joiner
    .replace(/\u200D/g, "") // zero-width joiner
    .replace(/\u2028/g, "") // line separator
    .replace(/\u00AD/g, "") // soft hyphen
    .replace(/\uFEFF/g, ""); // zero-width no-break space
}

async function runCleanup() {
  try {
    // connect to Mongo
    await mongoose.connect(process.env.URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    const products = await Product.find({});
    console.log(`Found ${products.length} products.`);

    for (const p of products) {
      let changed = false;

    
      if (p.benefits) {
        const cleaned = cleanDevanagari(p.benefits);
        if (cleaned !== p.benefits) {
          p.benefits = cleaned;
          changed = true;
        }
      }

      if (changed) {
        await p.save();
        console.log(`✨ Cleaned product: ${p._id}`);
      }
    }

    console.log("✅ Cleanup complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

runCleanup();
