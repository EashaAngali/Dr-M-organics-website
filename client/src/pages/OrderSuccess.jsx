import { Link, useParams } from "react-router-dom";

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <section className="section page-section empty-state success-state">
      <span className="section-tag">Order Confirmed</span>
      <h2>Thank you for your order</h2>
      <p>Your order has been placed successfully.</p>
      <p><strong>Order ID:</strong> {id}</p>
      <p>We have sent the confirmation email if email settings are configured.</p>
      <Link to="/shop" className="btn primary-btn">Continue Shopping</Link>
    </section>
  );
};

export default OrderSuccess;
