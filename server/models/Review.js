import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    type: { type: String, default: "" },
    data: { type: String, required: true }
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    review: { type: String, required: true, trim: true, maxlength: 2500 },
    experience: { type: String, default: "", trim: true, maxlength: 500 },
    skinType: { type: String, default: "", trim: true, maxlength: 60 },
    duration: { type: String, default: "", trim: true, maxlength: 80 },
    recommend: { type: Boolean, default: true },
    photos: { type: [mediaSchema], default: [] },
    video: { type: mediaSchema, default: undefined },
    verifiedPurchase: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending", index: true },
    adminReply: { type: String, default: "", trim: true, maxlength: 1200 },
    helpfulCount: { type: Number, default: 0 },
    reports: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
