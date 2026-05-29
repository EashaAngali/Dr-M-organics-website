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
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
