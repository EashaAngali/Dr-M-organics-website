import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AdminDashboard = () => {
  const { admin } = useAuth();

  return (
    <section className="section page-section">
      <div className="section-heading">
        <span className="section-tag">Dashboard</span>
        <h2>Welcome, {admin?.name}</h2>
        <p>Manage Dr M Organics products and orders.</p>
      </div>

      <div className="dashboard-grid">
        <Link to="/admin/products" className="dashboard-card">
          <h3>Products</h3>
          <p>Add, edit, and delete shop products.</p>
        </Link>
        <Link to="/admin/orders" className="dashboard-card">
          <h3>Orders</h3>
          <p>View orders and update order status.</p>
        </Link>
        <Link to="/admin/reviews" className="dashboard-card">
          <h3>Reviews</h3>
          <p>Moderate customer reviews, photos, and official replies.</p>
        </Link>
        <Link to="/shop" className="dashboard-card">
          <h3>View Store</h3>
          <p>Open the public product collection.</p>
        </Link>
      </div>
    </section>
  );
};

export default AdminDashboard;
