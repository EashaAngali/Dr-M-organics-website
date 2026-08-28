import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    subtotal,
    deliveryCharge,
    clearCart
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // COUPON STATES
  // =========================
  const [couponCode, setCouponCode] = useState("");
  const [couponInfo, setCouponInfo] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  // =========================
  // CUSTOMER FORM
  // =========================
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "Cash on Delivery",
    notes: ""
  });

  const updateForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  // DISCOUNT
  // =========================
  const discountAmount = couponInfo?.discountAmount || 0;

  const finalTotal = useMemo(() => {
    return Math.max(
      0,
      subtotal - discountAmount + deliveryCharge
    );
  }, [subtotal, discountAmount, deliveryCharge]);

  // =========================
  // APPLY COUPON
  // =========================
  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();

    setCouponError("");
    setCouponInfo(null);

    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    setCouponLoading(true);

    try {
      const { data } = await api.post(
        "/api/orders/validate-coupon",
        {
          couponCode: code,
          subtotal
        }
      );

      setCouponInfo(data);
      setCouponCode(data.code);

    } catch (error) {
      setCouponError(
        error.response?.data?.message ||
          "Invalid coupon code."
      );
    } finally {
      setCouponLoading(false);
    }
  };

  // =========================
  // REMOVE COUPON
  // =========================
  const removeCoupon = () => {
    setCouponCode("");
    setCouponInfo(null);
    setCouponError("");
  };

  // =========================
  // PLACE ORDER
  // =========================
  const placeOrder = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const payload = {
        ...form,

        couponCode: couponInfo?.code || "",

        items: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity
        }))
      };

      const { data } = await api.post(
        "/api/orders",
        payload
      );

      clearCart();

      navigate(`/order-success/${data._id}`);

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Order could not be placed."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EMPTY CART
  // =========================
  if (!cartItems.length) {
    return (
      <section className="section page-section empty-state">
        <h2>Your cart is empty</h2>

        <Link
          to="/shop"
          className="btn primary-btn"
        >
          Shop Products
        </Link>
      </section>
    );
  }

  return (
    <section className="section page-section">

      <div className="section-heading">
        <span className="section-tag">
          Checkout
        </span>

        <h2>
          Place Your Order
        </h2>
      </div>

      <div className="checkout-layout">

        {/* CUSTOMER FORM */}
        <form
          className="form-card"
          onSubmit={placeOrder}
        >
          {error && (
            <p className="error-text">
              {error}
            </p>
          )}

          <div className="form-grid">

            <input
              name="customerName"
              value={form.customerName}
              onChange={updateForm}
              placeholder="Full name"
              required
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateForm}
              placeholder="Email"
              required
            />

            <input
              name="phone"
              value={form.phone}
              onChange={updateForm}
              placeholder="Phone / WhatsApp"
              required
            />

            <input
              name="city"
              value={form.city}
              onChange={updateForm}
              placeholder="City"
              required
            />

          </div>

          <textarea
            name="address"
            value={form.address}
            onChange={updateForm}
            placeholder="Complete delivery address"
            required
          />

          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={updateForm}
          >
            <option>Cash on Delivery</option>
            <option>Bank Transfer</option>
            <option>JazzCash</option>
            <option>Easypaisa</option>
            <option>WhatsApp Confirmation</option>
          </select>

          <textarea
            name="notes"
            value={form.notes}
            onChange={updateForm}
            placeholder="Order notes, optional"
          />

          <button
            className="btn primary-btn full-btn"
            disabled={loading}
          >
            {loading
              ? "Placing Order..."
              : "Place Order"}
          </button>
        </form>


        {/* ORDER SUMMARY */}
        <aside className="summary-card">

          <h3>
            Order Summary
          </h3>

          {cartItems.map((item) => (
            <p key={item._id}>

              <span>
                {item.name} × {item.quantity}
              </span>

              <strong>
                Rs. {item.price * item.quantity}
              </strong>

            </p>
          ))}


          {/* SUBTOTAL */}
          <p>
            <span>
              Subtotal
            </span>

            <strong>
              Rs. {subtotal}
            </strong>
          </p>


          {/* =========================
              COUPON SECTION
          ========================= */}
          <div className="coupon-box">

            <label htmlFor="couponCode">
              Have a Coupon Code?
            </label>

            <div className="coupon-row">

              <input
                id="couponCode"
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(
                    e.target.value.toUpperCase()
                  );

                  setCouponError("");
                }}
                placeholder="Enter coupon code"
                disabled={Boolean(couponInfo)}
              />

              {!couponInfo ? (
                <button
                  type="button"
                  className="coupon-apply-btn"
                  onClick={applyCoupon}
                  disabled={couponLoading}
                >
                  {couponLoading
                    ? "Checking..."
                    : "Apply"}
                </button>
              ) : (
                <button
                  type="button"
                  className="coupon-remove-btn"
                  onClick={removeCoupon}
                >
                  Remove
                </button>
              )}

            </div>


            {/* SUCCESS MESSAGE */}
            {couponInfo && (
              <div className="coupon-success">

                ✓ Coupon{" "}

                <strong>
                  {couponInfo.code}
                </strong>

                {" "}applied —{" "}

                {couponInfo.discountPercent}% OFF

              </div>
            )}


            {/* ERROR MESSAGE */}
            {couponError && (
              <div className="coupon-error">
                {couponError}
              </div>
            )}

          </div>


          {/* DISCOUNT */}
          {couponInfo && (
            <p className="discount-line">

              <span>
                Discount ({couponInfo.discountPercent}%)
              </span>

              <strong>
                - Rs. {discountAmount}
              </strong>

            </p>
          )}


          {/* DELIVERY */}
          <p>
            <span>
              Delivery
            </span>

            <strong>
              Rs. {deliveryCharge}
            </strong>
          </p>


          {/* FINAL TOTAL */}
          <p className="summary-total">

            <span>
              Total
            </span>

            <strong>
              Rs. {finalTotal}
            </strong>

          </p>

        </aside>

      </div>

    </section>
  );
};

export default Checkout;
