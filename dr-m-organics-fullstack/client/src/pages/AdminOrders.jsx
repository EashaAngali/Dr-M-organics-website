import { useEffect, useState } from "react";
import api from "../api/axios.js";

const statuses = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  const loadOrders = async () => {
    const { data } = await api.get("/api/orders");
    setOrders(data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, orderStatus) => {
    setMessage("");
    try {
      await api.put(`/api/orders/${id}/status`, { orderStatus });
      setMessage("Order status updated.");
      loadOrders();
    } catch (error) {
      setMessage("Status update failed.");
    }
  };

  return (
    <section className="section page-section">
      <div className="section-heading">
        <span className="section-tag">Admin</span>
        <h2>Manage Orders</h2>
      </div>

      {message && <p className="form-message center-text">{message}</p>}

      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-head">
              <div>
                <h3>Order #{order._id}</h3>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <select value={order.orderStatus} onChange={(e) => updateStatus(order._id, e.target.value)}>
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>

            <div className="order-grid">
              <div>
                <h4>Customer</h4>
                <p>{order.customerName}</p>
                <p>{order.email}</p>
                <p>{order.phone}</p>
                <p>{order.address}, {order.city}</p>
              </div>
              <div>
                <h4>Items</h4>
                {order.items.map((item, index) => (
                  <p key={index}>{item.name} × {item.quantity} — Rs. {item.price * item.quantity}</p>
                ))}
              </div>
              <div>
                <h4>Payment</h4>
                <p>{order.paymentMethod}</p>
                <p>Subtotal: Rs. {order.subtotal}</p>
                <p>Delivery: Rs. {order.deliveryCharge}</p>
                <p><strong>Total: Rs. {order.total}</strong></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminOrders;
