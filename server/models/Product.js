import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: 0 },
    description: { type: String, required: true },
    ingredients: { type: String, default: "" },
    usage: { type: String, default: "" },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    shortBenefit: { type: String, default: "" },
    badge: { type: String, enum: ["", "Best Seller", "New", "Trending"], default: "" },
    size: { type: String, default: "" },
    benefits: { type: String, default: "" },
    suitableFor: { type: String, default: "" },
    precautions: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
