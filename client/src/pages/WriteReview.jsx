import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaRegStar } from "react-icons/fa";
import api from "../api/axios.js";

const WriteReview = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await api.get("/api/products");
        setProducts(data);
      } catch (error) {
        setError("Products could not be loaded. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="section page-section write-review-page">

      <div className="review-page-hero">
        <span className="section-tag">
          Customer Reviews
        </span>

        <FaRegStar className="review-page-icon" />

        <h1>
          Which product would you like to review?
        </h1>

        <p>
          Select the Dr M Organics product you used.
          We’ll take you directly to its customer review form.
        </p>
      </div>

      {loading && (
        <p className="center-text">
          Loading products...
        </p>
      )}

      {error && (
        <p className="error-text">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="review-product-grid">

          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}?writeReview=1#reviews`}
              className="review-product-card"
            >

              <div className="review-product-image">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />
              </div>

              <div className="review-product-info">

                <span>
                  {product.category}
                </span>

                <h3>
                  {product.name}
                </h3>

                <strong>
                  Review this product
                  <FaArrowRight />
                </strong>

              </div>

            </Link>
          ))}

        </div>
      )}

      {!loading &&
        !error &&
        products.length === 0 && (
          <div className="empty-review-state">
            <h3>No products available</h3>
            <p>
              Products will appear here when they are available.
            </p>
          </div>
        )}

    </section>
  );
};

export default WriteReview;
