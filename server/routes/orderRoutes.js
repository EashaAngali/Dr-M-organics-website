import express from "express";

import Order from "../models/Order.js";

import Product from "../models/Product.js";

import sendEmail from "../utils/sendEmail.js";

import {
  protect
} from "../middleware/authMiddleware.js";

import {
  getCoupon
} from "../utils/coupons.js";


const router =
  express.Router();



/* =====================================
   CALCULATE COUPON DISCOUNT
===================================== */

const calculateDiscount = (
  subtotal,
  couponCode
) => {

  const coupon =
    getCoupon(couponCode);


  if (!coupon) {

    return {

      couponCode: "",

      discountPercent: 0,

      discountAmount: 0

    };

  }


  const discountAmount =
    Math.round(
      (
        subtotal *
        coupon.discountPercent
      ) / 100
    );


  return {

    couponCode:
      coupon.code,

    discountPercent:
      coupon.discountPercent,

    discountAmount

  };
};



/* =====================================
   ORDER EMAIL
===================================== */

const buildOrderHtml =
  (order) => {

    const rows =
      order.items

        .map(
          (item) => `

            <tr>

              <td
                style="
                  padding:8px;
                  border:1px solid #ddd;
                "
              >
                ${item.name}
              </td>

              <td
                style="
                  padding:8px;
                  border:1px solid #ddd;
                  text-align:center;
                "
              >
                ${item.quantity}
              </td>

              <td
                style="
                  padding:8px;
                  border:1px solid #ddd;
                  text-align:right;
                "
              >
                Rs. ${item.price}
              </td>

            </tr>

          `
        )

        .join("");


    const couponRow =
      order.discountAmount > 0

        ? `

          <p>
            <strong>
              Coupon:
            </strong>

            ${order.couponCode}

            (${order.discountPercent}% OFF)
          </p>

          <p>
            <strong>
              Discount:
            </strong>

            - Rs. ${order.discountAmount}
          </p>

        `

        : "";


    return `

      <div
        style="
          font-family:Arial,sans-serif;
          color:#222;
          max-width:700px;
          margin:auto;
        "
      >

        <h2
          style="
            color:#3f6f3b;
          "
        >
          Dr M Organics Order Confirmation
        </h2>


        <p>
          Thank you,

          <strong>
            ${order.customerName}
          </strong>.

          Your order has been received.
        </p>


        <p>

          <strong>
            Order ID:
          </strong>

          ${order._id}

        </p>


        <p>

          <strong>
            Phone:
          </strong>

          ${order.phone}

        </p>


        <p>

          <strong>
            Address:
          </strong>

          ${order.address},
          ${order.city}

        </p>


        <p>

          <strong>
            Payment:
          </strong>

          ${order.paymentMethod}

        </p>


        <table
          style="
            border-collapse:collapse;
            width:100%;
            margin-top:15px;
          "
        >

          <thead>

            <tr
              style="
                background:#edf5e8;
              "
            >

              <th
                style="
                  padding:8px;
                  border:1px solid #ddd;
                  text-align:left;
                "
              >
                Product
              </th>

              <th
                style="
                  padding:8px;
                  border:1px solid #ddd;
                "
              >
                Qty
              </th>

              <th
                style="
                  padding:8px;
                  border:1px solid #ddd;
                  text-align:right;
                "
              >
                Price
              </th>

            </tr>

          </thead>

          <tbody>
            ${rows}
          </tbody>

        </table>


        <p>

          <strong>
            Subtotal:
          </strong>

          Rs. ${order.subtotal}

        </p>


        ${couponRow}


        <p>

          <strong>
            Delivery:
          </strong>

          Rs. ${order.deliveryCharge}

        </p>


        <h3>

          Total:
          Rs. ${order.total}

        </h3>


      </div>

    `;
  };



/* =====================================
   VALIDATE COUPON
===================================== */

router.post(
  "/validate-coupon",
  async (req, res) => {

    const {
      couponCode,
      subtotal
    } = req.body;


    const coupon =
      getCoupon(couponCode);


    if (!coupon) {

      return res
        .status(400)
        .json({

          message:
            "Invalid or expired coupon code."

        });

    }


    const cleanSubtotal =
      Math.max(
        0,
        Number(subtotal) || 0
      );


    const discountAmount =
      Math.round(
        (
          cleanSubtotal *
          coupon.discountPercent
        ) / 100
      );


    return res.json({

      valid: true,

      code:
        coupon.code,

      discountPercent:
        coupon.discountPercent,

      discountAmount

    });

  }
);



/* =====================================
   CREATE ORDER
===================================== */

router.post(
  "/",
  async (req, res) => {

    const {

      customerName,

      email,

      phone,

      address,

      city,

      items,

      paymentMethod,

      notes,

      couponCode = ""

    } = req.body;


    if (
      !customerName ||
      !email ||
      !phone ||
      !address ||
      !city
    ) {

      return res
        .status(400)
        .json({

          message:
            "All customer details are required"

        });

    }


    if (
      !items ||
      !items.length
    ) {

      return res
        .status(400)
        .json({

          message:
            "Cart is empty"

        });

    }


    const cleanItems = [];

    let subtotal = 0;


    /*
     * IMPORTANT:
     * Prices are taken from MongoDB.
     * Customer cannot change product
     * price from frontend.
     */

    for (
      const item of items
    ) {

      const product =
        await Product.findById(
          item.product ||
          item._id
        );


      if (!product) {

        return res
          .status(404)
          .json({

            message:
              `Product not found: ${
                item.name ||
                item.product
              }`

          });

      }


      const quantity =
        Math.max(
          1,
          Number(
            item.quantity
          ) || 1
        );


      cleanItems.push({

        product:
          product._id,

        name:
          product.name,

        price:
          product.price,

        quantity,

        image:
          product.image

      });


      subtotal +=
        product.price *
        quantity;

    }


    /*
     * Backend calculates coupon again.
     * Frontend discount cannot be trusted.
     */

    const couponDetails =
      calculateDiscount(
        subtotal,
        couponCode
      );


    if (
      couponCode &&
      !couponDetails.couponCode
    ) {

      return res
        .status(400)
        .json({

          message:
            "The coupon code is no longer valid."

        });

    }


    /*
     * Your existing website shipping:
     * Rs.250 below Rs.3000.
     */

    const deliveryCharge =
      subtotal >= 3000
        ? 0
        : 250;


    const total =
      Math.max(

        0,

        subtotal -
        couponDetails.discountAmount +
        deliveryCharge

      );


    const order =
      await Order.create({

        customerName,

        email,

        phone,

        address,

        city,

        items:
          cleanItems,

        subtotal,


        couponCode:
          couponDetails.couponCode,

        discountPercent:
          couponDetails.discountPercent,

        discountAmount:
          couponDetails.discountAmount,


        deliveryCharge,

        total,

        paymentMethod,

        notes

      });


    const html =
      buildOrderHtml(order);


    /*
     * Give response immediately.
     */

    res
      .status(201)
      .json(order);


    /*
     * Send emails after order.
     */

    Promise.allSettled([

      sendEmail({

        to: email,

        subject:
          `Dr M Organics Order Confirmation - ${order._id}`,

        html

      }),


      process.env.ADMIN_NOTIFY_EMAIL

        ? sendEmail({

            to:
              process.env.ADMIN_NOTIFY_EMAIL,

            subject:
              `New Dr M Organics Order - ${order._id}`,

            html

          })

        : Promise.resolve()

    ])

      .then(
        (results) => {

          results.forEach(
            (result) => {

              if (
                result.status ===
                "rejected"
              ) {

                console.error(
                  "Email error:",
                  result.reason.message
                );

              }

            }
          );

        }
      );

  }
);



/* =====================================
   ADMIN GET ORDERS
===================================== */

router.get(
  "/",
  protect,
  async (req, res) => {

    const orders =
      await Order.find()
        .sort({
          createdAt: -1
        });


    res.json(orders);

  }
);



/* =====================================
   ADMIN GET SINGLE ORDER
===================================== */

router.get(
  "/:id",
  protect,
  async (req, res) => {

    const order =
      await Order.findById(
        req.params.id
      );


    if (!order) {

      return res
        .status(404)
        .json({

          message:
            "Order not found"

        });

    }


    res.json(order);

  }
);



/* =====================================
   CHANGE ORDER STATUS
===================================== */

router.put(
  "/:id/status",
  protect,
  async (req, res) => {

    const {
      orderStatus
    } = req.body;


    const order =
      await Order.findById(
        req.params.id
      );


    if (!order) {

      return res
        .status(404)
        .json({

          message:
            "Order not found"

        });

    }


    order.orderStatus =
      orderStatus ||
      order.orderStatus;


    await order.save();


    res.json(order);

  }
);


export default router;
