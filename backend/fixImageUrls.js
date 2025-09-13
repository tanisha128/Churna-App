const mongoose = require("mongoose");
const Product = require("./model/product"); 

const MONGO_URI = process.env.URL || "mongodb+srv://dbUser:tanu9850@cluster0.nydrks1.mongodb.net/ayurvedaDB?retryWrites=true&w=majority&appName=Cluster0";
const DEPLOYED_URL = "https://churna-app.onrender.com";

(async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const result = await Product.updateMany(
      { image_url: { $regex: "localhost:5000" } },
      [
        {
          $set: {
            image_url: {
              $replaceOne: {
                input: "$image_url",
                find: "http://localhost:5000",
                replacement: DEPLOYED_URL
              }
            }
          }
        }
      ]
    );

    console.log(`✅ Updated ${result.modifiedCount} products`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
