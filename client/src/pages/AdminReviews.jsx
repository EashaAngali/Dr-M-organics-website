import { useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";
import RatingStars from "../components/RatingStars.jsx";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filters, setFilters] = useState({ status: "All", rating: "", verified: "", search: "", sort: "newest" });
  const [message, setMessage] = useState("");

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => value && value !== "All" && params.set(key, value));
    return params.toString();
  }, [filters]);

  const load = async () => {
    const { data } = await api.get(`/api/reviews${query ? `?${query}` : ""}`);
    setReviews(data);
  };

  useEffect(() => { load().catch(() => setMessage("Reviews could not be loaded.")); }, [query]);

  const update = async (id, updates) => {
    const { data } = await api.put(`/api/reviews/${id}`, updates);
    setReviews((current) => current.map((item) => item._id === id ? data : item));
    setMessage("Review updated.");
  };

  const remove = async (id) => {
    if (!confirm("Delete this review permanently?")) return;
    await api.delete(`/api/reviews/${id}`);
    setReviews((current) => current.filter((item) => item._id !== id));
  };

  return (
    <section className="section page-section">
      <div className="section-heading"><span className="section-tag">Admin</span><h2>Review Management</h2><p>Approve, reject, feature, reply to, search, and moderate customer reviews.</p></div>
      {message && <p className="form-message">{message}</p>}

      <div className="review-admin-filters">
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option>All</option><option>Pending</option><option>Approved</option><option>Rejected</option></select>
        <select value={filters.rating} onChange={(e) => setFilters({ ...filters, rating: e.target.value })}><option value="">All ratings</option>{[5,4,3,2,1].map((rating) => <option value={rating} key={rating}>{rating} stars</option>)}</select>
        <select value={filters.verified} onChange={(e) => setFilters({ ...filters, verified: e.target.value })}><option value="">All purchases</option><option value="true">Verified only</option><option value="false">Unverified only</option></select>
        <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="highest">Highest rating</option><option value="lowest">Lowest rating</option></select>
        <input placeholder="Search reviews..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
      </div>

      <div className="admin-review-list">
        {!reviews.length && <div className="empty-review-state"><h3>No reviews found</h3><p>Try changing the filters.</p></div>}
        {reviews.map((item) => (
          <article className="admin-review-card" key={item._id}>
            <div className="admin-review-head">
              <div><strong>{item.name}</strong><span>{item.email}</span></div>
              <div><span className={`status-pill status-${item.status.toLowerCase()}`}>{item.status}</span>{item.verifiedPurchase && <span className="verified-badge">✓ Verified Purchase</span>}</div>
            </div>
            <p className="product-category">{item.product?.name || "Product"}</p>
            <RatingStars value={item.rating} />
            <h3>{item.title}</h3>
            <p>{item.review}</p>
            <details className="admin-edit-review">
              <summary>Edit review text</summary>
              <input id={`title-${item._id}`} defaultValue={item.title} aria-label="Review title" />
              <textarea id={`review-${item._id}`} defaultValue={item.review} aria-label="Review text" />
              <button className="small-btn" onClick={() => update(item._id, { title: document.getElementById(`title-${item._id}`).value, review: document.getElementById(`review-${item._id}`).value })}>Save Review Edits</button>
            </details>
            {!!item.photos?.length && <div className="review-photos admin-media">{item.photos.map((photo, index) => <img src={photo.data} alt="Customer upload" key={index} />)}</div>}
            {item.video?.data && <video controls className="review-video" src={item.video.data} />}

            <div className="admin-review-actions">
              <button className="small-btn" onClick={() => update(item._id, { status: "Approved" })}>Approve</button>
              <button className="small-btn" onClick={() => update(item._id, { status: "Rejected" })}>Reject</button>
              <button className="small-btn" onClick={() => update(item._id, { status: "Pending" })}>Pending</button>
              <button className="small-btn" onClick={() => update(item._id, { featured: !item.featured })}>{item.featured ? "Unfeature" : "Feature"}</button>
              <button className="small-btn danger" onClick={() => remove(item._id)}>Delete</button>
            </div>

            <div className="admin-reply-box">
              <textarea defaultValue={item.adminReply || ""} placeholder="Official Dr M Organics response..." id={`reply-${item._id}`} />
              <button className="btn secondary-btn" onClick={() => update(item._id, { adminReply: document.getElementById(`reply-${item._id}`).value })}>Save Official Reply</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AdminReviews;
