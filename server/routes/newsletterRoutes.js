import express from "express";
import Newsletter from "../models/Newsletter.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const subscriber = await Newsletter.create({ email });
    res.status(201).json(subscriber);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "This email is already subscribed" });
    }
    res.status(500).json({ message: "Newsletter subscription failed" });
  }
});

export default router;
