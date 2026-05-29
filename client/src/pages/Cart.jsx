import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, subtotal, deliveryCharge, total } = useCart();

  if (!cartItems.length) {
    return (
      <section className="section page-section empty-state">
        <h2>Your cart is empty</h2>
        <p>Add your favorite Dr M Organics products to continue.</p>
        <Link to="/shop" className="btn primary-btn">Shop Now</Link>
      </section>
    );
  }

  return (
    <section className="section page-section">
      <div className="section-heading">
        <span className="section-tag">Cart</span>
        <h2>Your Shopping Cart</h2>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item._id}>
              <img src={item.image} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>Rs. {item.price}</p>
                <button className="text-btn" onClick={() => removeFromCart(item._id)}>Remove</button>
              </div>
              <div className="quantity-row small">
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
              </div>
              <strong>Rs. {item.price * item.quantity}</strong>
            </div>
          ))}
        </div>

        <aside className="summary-card">
          <h3>Order Summary</h3>
          <p><span>Subtotal</span><strong>Rs. {subtotal}</strong></p>
          <p><span>Delivery</span><strong>Rs. {deliveryCharge}</strong></p>
          <p className="summary-total"><span>Total</span><strong>Rs. {total}</strong></p>
          <Link to="/checkout" className="btn primary-btn full-btn">Proceed to Checkout</Link>
        </aside>
      </div>
    </section>
  );
};

export default Cart;
