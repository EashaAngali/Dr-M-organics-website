import express from "express";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const approxBase64Bytes = (data = "") => {
  const payload = data.includes(",") ? data.split(",")[1] : data;
  return Math.ceil((payload.length * 3) / 4);
};

const reviewSummary = async (productId) => {
  const rows = await Review.aggregate([
    { $match: { product: productId, status: "Approved" } },
    {
      $group: {
        _id: null,
        average: { $avg: "$rating" },
        total: { $sum: 1 },
        recommendCount: { $sum: { $cond: ["$recommend", 1, 0] } }
      }
    }
  ]);

  const distRows = await Review.aggregate([
    { $match: { product: productId, status: "Approved" } },
    { $group: { _id: "$rating", count: { $sum: 1 } } }
  ]);

  const base = rows[0] || { average: 0, total: 0, recommendCount: 0 };
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  distRows.forEach((row) => {
    distribution[row._id] = row.count;
  });

  return {
    average: Number((base.average || 0).toFixed(1)),
    total: base.total || 0,
    recommendPercent: base.total ? Math.round((base.recommendCount / base.total) * 100) : 0,
    distribution
  };
};

router.get("/featured", async (req, res) => {
  const reviews = await Review.find({ status: "Approved", featured: true })
    .populate("product", "name image slug")
    .select("-email")
    .sort({ createdAt: -1 })
    .limit(10);
  res.json(reviews);
});

router.get("/product/:productId", async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 6));
  const filter = { product: req.params.productId, status: "Approved" };
  const productObjectId = (await Product.findById(req.params.productId).select("_id"))?._id;
  if (!productObjectId) return res.status(404).json({ message: "Product not found" });

  const [reviews, total, summary] = await Promise.all([
    Review.find(filter).select("-email").sort({ featured: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Review.countDocuments(filter),
    reviewSummary(productObjectId)
  ]);

  res.json({ reviews, summary, page, pages: Math.max(1, Math.ceil(total / limit)) });
});

router.post("/", async (req, res) => {
  const {
    productId,
    name,
    email,
    rating,
    title,
    review,
    experience = "",
    skinType = "",
    duration = "",
    recommend = true,
    photos = [],
    video
  } = req.body;

  if (!productId || !name || !email || !rating || !title || !review) {
    return res.status(400).json({ message: "Please complete all required review fields." });
  }

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (!Array.isArray(photos) || photos.length > 5) {
    return res.status(400).json({ message: "You can upload up to 5 review photos." });
  }

  for (const photo of photos) {
    if (!photo?.type?.startsWith("image/") || approxBase64Bytes(photo.data) > 1.5 * 1024 * 1024) {
      return res.status(400).json({ message: "Each review photo must be an image smaller than 1.5 MB." });
    }
  }

  if (video) {
    if (!video?.type?.startsWith("video/") || approxBase64Bytes(video.data) > 4 * 1024 * 1024) {
      return res.status(400).json({ message: "Review video must be a video smaller than 4 MB." });
    }
  }

  const verifiedOrder = await Order.findOne({
    email: String(email).toLowerCase().trim(),
    orderStatus: { $in: ["Confirmed", "Packed", "Shipped", "Delivered"] },
    "items.product": product._id
  }).select("_id");

  const created = await Review.create({
    product: product._id,
    name,
    email,
    rating: Number(rating),
    title,
    review,
    experience,
    skinType,
    duration,
    recommend: Boolean(recommend),
    photos,
    video,
    verifiedPurchase: Boolean(verifiedOrder),
    status: "Pending"
  });

  res.status(201).json({
    message: "Thank you. Your review has been submitted for approval.",
    reviewId: created._id,
    verifiedPurchase: created.verifiedPurchase
  });
});

router.post("/:id/helpful", async (req, res) => {
  const review = await Review.findOneAndUpdate(
    { _id: req.params.id, status: "Approved" },
    { $inc: { helpfulCount: 1 } },
    { new: true }
  );
  if (!review) return res.status(404).json({ message: "Review not found" });
  res.json({ helpfulCount: review.helpfulCount });
});

router.post("/:id/report", async (req, res) => {
  const review = await Review.findOneAndUpdate(
    { _id: req.params.id, status: "Approved" },
    { $inc: { reports: 1 } },
    { new: true }
  );
  if (!review) return res.status(404).json({ message: "Review not found" });
  res.json({ message: "Review reported. Thank you for the feedback." });
});

router.get("/", protect, async (req, res) => {
  const { status, rating, verified, search, sort = "newest" } = req.query;
  const filter = {};
  if (status && status !== "All") filter.status = status;
  if (rating) filter.rating = Number(rating);
  if (verified === "true") filter.verifiedPurchase = true;
  if (verified === "false") filter.verifiedPurchase = false;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { title: { $regex: search, $options: "i" } },
      { review: { $regex: search, $options: "i" } }
    ];
  }

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    highest: { rating: -1, createdAt: -1 },
    lowest: { rating: 1, createdAt: -1 }
  };

  const reviews = await Review.find(filter)
    .populate("product", "name image")
    .sort(sortMap[sort] || sortMap.newest);
  res.json(reviews);
});

router.put("/:id", protect, async (req, res) => {
  try {

    // Admin is ONLY allowed to moderate reviews.
    // Admin cannot modify customer-written content.

    const allowedFields = [
      "status",
      "featured",
      "adminReply"
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const review =
      await Review.findByIdAndUpdate(
        req.params.id,
        updates,
        {
          new: true,
          runValidators: true
        }
      ).populate(
        "product",
        "name image"
      );

    if (!review) {
      return res
        .status(404)
        .json({
          message: "Review not found"
        });
    }

    res.json(review);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Unable to update review"
    });

  }
});
router.delete("/:id", protect, async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: "Review not found" });
  await review.deleteOne();
  res.json({ message: "Review deleted" });
});

export default router;
