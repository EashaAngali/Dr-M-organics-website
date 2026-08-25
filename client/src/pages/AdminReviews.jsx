import { useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";
import RatingStars from "../components/RatingStars.jsx";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);

  const [filters, setFilters] = useState({
    status: "All",
    rating: "",
    verified: "",
    search: "",
    sort: "newest",
  });

  const [message, setMessage] = useState("");

  const query = useMemo(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "All") {
        params.set(key, value);
      }
    });

    return params.toString();
  }, [filters]);

  const loadReviews = async () => {
    try {
      const { data } = await api.get(
        `/api/reviews${query ? `?${query}` : ""}`
      );

      setReviews(data);
    } catch (error) {
      setMessage("Customer reviews could not be loaded.");
    }
  };

  useEffect(() => {
    loadReviews();
  }, [query]);

  const updateReview = async (
    id,
    updates,
    successMessage = "Review updated."
  ) => {
    try {
      const { data } = await api.put(`/api/reviews/${id}`, updates);

      setReviews((current) =>
        current.map((item) =>
          item._id === id ? data : item
        )
      );

      setMessage(successMessage);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to update review."
      );
    }
  };

  const deleteReview = async (id) => {
    const confirmed = window.confirm(
      "Delete this customer review permanently?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/api/reviews/${id}`);

      setReviews((current) =>
        current.filter((item) => item._id !== id)
      );

      setMessage("Customer review deleted.");
    } catch (error) {
      setMessage("Unable to delete review.");
    }
  };

  return (
    <section className="section page-section">

      <div className="section-heading">
        <span className="section-tag">
          Admin • Review Moderation
        </span>

        <h2>Customer Reviews</h2>

        <p>
          Reviews are submitted only by customers from product pages.
          Admin can approve, reject, feature, delete, or reply to them.
        </p>
      </div>

      {message && (
        <p className="form-message">
          {message}
        </p>
      )}

      {/* FILTERS */}

      <div className="review-admin-filters">

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({
              ...filters,
              status: e.target.value,
            })
          }
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={filters.rating}
          onChange={(e) =>
            setFilters({
              ...filters,
              rating: e.target.value,
            })
          }
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>

        <select
          value={filters.verified}
          onChange={(e) =>
            setFilters({
              ...filters,
              verified: e.target.value,
            })
          }
        >
          <option value="">All Purchases</option>
          <option value="true">Verified Purchase</option>
          <option value="false">Unverified</option>
        </select>

        <select
          value={filters.sort}
          onChange={(e) =>
            setFilters({
              ...filters,
              sort: e.target.value,
            })
          }
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>

        <input
          type="text"
          placeholder="Search customer reviews..."
          value={filters.search}
          onChange={(e) =>
            setFilters({
              ...filters,
              search: e.target.value,
            })
          }
        />

      </div>

      {/* REVIEWS */}

      <div className="admin-review-list">

        {reviews.length === 0 && (
          <div className="empty-review-state">
            <h3>No customer reviews found</h3>

            <p>
              Customer reviews submitted from product pages
              will appear here as Pending.
            </p>
          </div>
        )}

        {reviews.map((item) => (

          <article
            className="admin-review-card"
            key={item._id}
          >

            <div className="admin-review-head">

              <div>
                <strong>{item.name}</strong>

                <span>
                  {item.email}
                </span>
              </div>

              <div>

                <span
                  className={`status-pill status-${item.status.toLowerCase()}`}
                >
                  {item.status}
                </span>

                {item.verifiedPurchase && (
                  <span className="verified-badge">
                    ✓ Verified Purchase
                  </span>
                )}

              </div>

            </div>

            <p className="product-category">
              Review for:{" "}
              <strong>
                {item.product?.name || "Product"}
              </strong>
            </p>

            <RatingStars value={item.rating} />

            <h3>
              {item.title}
            </h3>

            <p>
              {item.review}
            </p>

            {(item.experience ||
              item.skinType ||
              item.duration) && (

              <div className="review-meta">

                {item.experience && (
                  <span>
                    Experience: {item.experience}
                  </span>
                )}

                {item.skinType && (
                  <span>
                    Skin Type: {item.skinType}
                  </span>
                )}

                {item.duration && (
                  <span>
                    Used For: {item.duration}
                  </span>
                )}

              </div>
            )}

            <p className="moderation-note">
              <strong>Customer submitted review.</strong>{" "}
              Admin cannot edit customer name, rating,
              title or review text.
            </p>

            {/* CUSTOMER PHOTOS */}

            {!!item.photos?.length && (

              <div className="review-photos admin-media">

                {item.photos.map((photo, index) => (

                  <img
                    key={index}
                    src={photo.data}
                    alt="Customer review"
                    loading="lazy"
                  />

                ))}

              </div>
            )}

            {/* CUSTOMER VIDEO */}

            {item.video?.data && (

              <video
                controls
                className="review-video"
                src={item.video.data}
                preload="metadata"
              />

            )}

            {/* ADMIN MODERATION BUTTONS */}

            <div className="admin-review-actions">

              <button
                className="small-btn"
                onClick={() =>
                  updateReview(
                    item._id,
                    { status: "Approved" },
                    "Customer review approved."
                  )
                }
              >
                Approve
              </button>

              <button
                className="small-btn"
                onClick={() =>
                  updateReview(
                    item._id,
                    { status: "Rejected" },
                    "Customer review rejected."
                  )
                }
              >
                Reject
              </button>

              <button
                className="small-btn"
                onClick={() =>
                  updateReview(
                    item._id,
                    { status: "Pending" },
                    "Review moved to Pending."
                  )
                }
              >
                Pending
              </button>

              <button
                className="small-btn"
                onClick={() =>
                  updateReview(
                    item._id,
                    {
                      featured: !item.featured,
                    },
                    item.featured
                      ? "Review removed from featured reviews."
                      : "Review marked as featured."
                  )
                }
              >
                {item.featured
                  ? "Unfeature"
                  : "Feature"}
              </button>

              <button
                className="small-btn danger"
                onClick={() =>
                  deleteReview(item._id)
                }
              >
                Delete
              </button>

            </div>

            {/* ADMIN CAN ONLY REPLY */}

            <div className="admin-reply-box">

              <label
                htmlFor={`reply-${item._id}`}
              >
                <strong>
                  Dr M Organics Official Reply
                </strong>

                <span>
                  {" "}
                  — separate from customer review
                </span>
              </label>

              <textarea
                id={`reply-${item._id}`}
                defaultValue={
                  item.adminReply || ""
                }
                placeholder="Write an optional official response..."
              />

              <button
                className="btn secondary-btn"
                onClick={() => {

                  const reply =
                    document.getElementById(
                      `reply-${item._id}`
                    ).value;

                  updateReview(
                    item._id,
                    {
                      adminReply: reply,
                    },
                    "Official reply saved."
                  );

                }}
              >
                Save Official Reply
              </button>

            </div>

          </article>

        ))}

      </div>

    </section>
  );
};

export default AdminReviews;
