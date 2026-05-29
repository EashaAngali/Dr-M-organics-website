import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import sendEmail from "../utils/sendEmail.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const buildOrderHtml = (order) => {
  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;">${item.name}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:right;">Rs. ${item.price}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#222;max-width:700px;margin:auto;">
      <h2 style="color:#3f6f3b;">Dr M Organics Order Confirmation</h2>
      <p>Thank you, <strong>${order.customerName}</strong>. Your order has been received.</p>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      <p><strong>Address:</strong> ${order.address}, ${order.city}</p>
      <p><strong>Payment:</strong> ${order.paymentMethod}</p>
      <table style="border-collapse:collapse;width:100%;margin-top:15px;">
        <thead>
          <tr style="background:#edf5e8;">
            <th style="padding:8px;border:1px solid #ddd;text-align:left;">Product</th>
            <th style="padding:8px;border:1px solid #ddd;">Qty</th>
            <th style="padding:8px;border:1px solid #ddd;text-align:right;">Price</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p><strong>Subtotal:</strong> Rs. ${order.subtotal}</p>
      <p><strong>Delivery:</strong> Rs. ${order.deliveryCharge}</p>
      <h3>Total: Rs. ${order.total}</h3>
    </div>
  `;
};

router.post("/", async (req, res) => {
  const {
    customerName,
    email,
    phone,
    address,
    city,
    items,
    paymentMethod,
    notes
  } = req.body;

  if (!customerName || !email || !phone || !address || !city) {
    return res.status(400).json({ message: "All customer details are required" });
  }

  if (!items || !items.length) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const cleanItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.product || item._id);
    if (!product) return res.status(404).json({ message: `Product not found: ${item.name}` });

    const quantity = Number(item.quantity) || 1;
    cleanItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image
    });

    subtotal += product.price * quantity;
  }

  const deliveryCharge = subtotal >= 3000 ? 0 : 250;
  const total = subtotal + deliveryCharge;

  const order = await Order.create({
    customerName,
    email,
    phone,
    address,
    city,
    items: cleanItems,
    subtotal,
    deliveryCharge,
    total,
    paymentMethod,
    notes
  });

  const html = buildOrderHtml(order);

  try {
    await sendEmail({
      to: email,
      subject: `Dr M Organics Order Confirmation - ${order._id}`,
      html
    });

    if (process.env.ADMIN_NOTIFY_EMAIL) {
      await sendEmail({
        to: process.env.ADMIN_NOTIFY_EMAIL,
        subject: `New Dr M Organics Order - ${order._id}`,
        html
      });
    }
  } catch (error) {
    console.error("Email error:", error.message);
  }

  res.status(201).json(order);
});

router.get("/", protect, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

router.get("/:id", protect, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

router.put("/:id/status", protect, async (req, res) => {
  const { orderStatus } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.orderStatus = orderStatus || order.orderStatus;
  await order.save();
  res.json(order);
});

export default router;
