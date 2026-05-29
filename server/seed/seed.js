import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import Admin from "../models/Admin.js";
import products from "../data/products.js";

dotenv.config();
await connectDB();

const seed = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);

    const adminEmail = process.env.ADMIN_EMAIL || "admin@drmorganics.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";
    const adminName = process.env.ADMIN_NAME || "Admin";

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await Admin.create({ name: adminName, email: adminEmail, password: adminPassword });
      console.log("Admin created");
    } else {
      console.log("Admin already exists");
    }

    console.log("Products seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
