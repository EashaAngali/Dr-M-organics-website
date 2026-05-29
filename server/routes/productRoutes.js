import express from "express";
import slugify from "slugify";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { category, search, featured } = req.query;
  const filter = {};

  if (category && category !== "All") filter.category = category;
  if (featured === "true") filter.isFeatured = true;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

router.post("/", protect, async (req, res) => {
  const productData = req.body;

  if (!productData.slug && productData.name) {
    productData.slug = slugify(productData.name, { lower: true, strict: true });
  }

  const product = await Product.create(productData);
  res.status(201).json(product);
});

router.put("/:id", protect, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const updates = req.body;
  if (updates.name && !updates.slug) {
    updates.slug = slugify(updates.name, { lower: true, strict: true });
  }

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });

  res.json(updatedProduct);
});

router.delete("/:id", protect, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  await product.deleteOne();
  res.json({ message: "Product deleted" });
});

export default router;
