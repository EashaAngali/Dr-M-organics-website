import {
  useEffect,
  useState
} from "react";

import { Link } from "react-router-dom";

import {
  FaCheckCircle,
  FaArrowRight
} from "react-icons/fa";

import api from "../api/axios.js";

import RatingStars
  from "../components/RatingStars.jsx";

const CustomerReviews = () => {

  const [reviews, setReviews] =
    useState([]);

  const [page, setPage] =
    useState(1);

  const [pages, setPages] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadReviews = async (
    targetPage = 1,
    append = false
  ) => {

    try {

      setLoading(true);

      const { data } =
        await api.get(
          `/api/reviews/public?page=${targetPage}&limit=9`
        );

      setReviews((current) =>
        append
          ? [...current, ...data.reviews]
          : data.reviews
      );

      setPage(data.page);

      setPages(data.pages);

    } catch (error) {

      setError(
        "Customer reviews could not be loaded."
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadReviews(1);
  }, []);

  return (
    <section
      className="section page-section customer-reviews-page"
    >

      <div className="reviews-page-header">

        <span className="section-tag">
          Real Customers • Real Experiences
        </span>

        <h1>
          Customer Experiences
        </h1>

        <p>
          Read genuine experiences shared
          by Dr M Organics customers.
          Only approved customer reviews
          appear here.
        </p>

      </div>

      {error && (
        <p className="review-message">
          {error}
        </p>
      )}

      {loading &&
        reviews.length === 0 && (
          <p className="reviews-loading">
            Loading customer reviews...
          </p>
        )}

      {!loading &&
        reviews.length === 0 &&
        !error && (

          <div className="empty-review-state">

            <h3>
              No approved reviews yet
            </h3>

            <p>
              Customer experiences will
              appear here after approval.
            </p>

          </div>
        )}

      <div className="all-customer-reviews">

        {reviews.map((review) => (

          <article
            className="public-review-card"
            key={review._id}
          >

            <div className="public-review-header">

              <div>
                <RatingStars
                  value={review.rating}
                />

                {review.verifiedPurchase && (
                  <span className="verified-badge">
                    <FaCheckCircle />
                    Verified Purchase
                  </span>
                )}
              </div>

              <time>
                {new Date(
                  review.createdAt
                ).toLocaleDateString()}
              </time>

            </div>

            <div className="review-product-mini">

              {review.product?.image && (
                <img
                  src={review.product.image}
                  alt={
                    review.product.name
                  }
                  loading="lazy"
                />
              )}

              <div>

                <span>
                  Review for
                </span>

                <strong>
                  {review.product?.name ||
                    "Dr M Organics Product"}
                </strong>

              </div>

            </div>

            <h3>
              {review.title}
            </h3>

            <p className="public-review-text">
              “{review.review}”
            </p>

            {(review.skinType ||
              review.duration) && (

              <div className="public-review-meta">

                {review.skinType && (
                  <span>
                    Skin Type:{" "}
                    {review.skinType}
                  </span>
                )}

                {review.duration && (
                  <span>
                    Used For:{" "}
                    {review.duration}
                  </span>
                )}

              </div>
            )}

            {!!review.photos?.length && (

              <div className="public-review-photos">

                {review.photos
                  .slice(0, 3)
                  .map(
                    (photo, index) => (

                      <img
                        key={index}
                        src={photo.data}
                        alt="Customer experience"
                        loading="lazy"
                      />

                    )
                  )}

              </div>
            )}

            {review.adminReply && (

              <div className="public-brand-reply">

                <strong>
                  Dr M Organics
                </strong>

                <p>
                  {review.adminReply}
                </p>

              </div>
            )}

            <div className="public-review-footer">

              <div className="review-customer">

                <strong>
                  {review.name}
                </strong>

                <span>
                  Dr M Organics Customer
                </span>

              </div>

              {review.product?._id && (

                <Link
                  to={`/product/${review.product._id}#reviews`}
                  className="view-product-review"
                >
                  View Product Review
                  <FaArrowRight />
                </Link>

              )}

            </div>

          </article>

        ))}

      </div>

      {page < pages && (

        <div className="reviews-load-more">

          <button
            className="btn secondary-btn"
            disabled={loading}
            onClick={() =>
              loadReviews(
                page + 1,
                true
              )
            }
          >
            {loading
              ? "Loading..."
              : "Load More Reviews"}
          </button>

        </div>
      )}

    </section>
  );
};

export default CustomerReviews;
