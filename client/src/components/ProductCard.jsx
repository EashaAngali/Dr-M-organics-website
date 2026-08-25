import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaHeart, FaRegHeart, FaShoppingBag } from "react-icons/fa";
import { useCart } from "../context/CartContext.jsx";
import RatingStars from "./RatingStars.jsx";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [quickView, setQuickView] = useState(false);
  const [wishlisted, setWishlisted] = useState(() => {
    const ids = JSON.parse(localStorage.getItem("drm_wishlist") || "[]");
    return ids.includes(product._id);
  });

  const salePercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const toggleWishlist = () => {
    const ids = JSON.parse(localStorage.getItem("drm_wishlist") || "[]");
    const next = ids.includes(product._id) ? ids.filter((id) => id !== product._id) : [...ids, product._id];
    localStorage.setItem("drm_wishlist", JSON.stringify(next));
    setWishlisted(next.includes(product._id));
  };

  return (
    <>
      <article className="product-card premium-product-card">
        <div className="product-img-wrap premium-product-image">
          <Link to={`/product/${product.slug || product._id}`} aria-label={`View ${product.name}`}>
            <img src={product.image} alt={product.name} loading="lazy" />
          </Link>
          <div className="product-badges">
            {product.badge && <span className="status-badge">{product.badge}</span>}
            {salePercent > 0 && <span className="sale-badge">-{salePercent}%</span>}
          </div>
          <button className="wishlist-button" onClick={toggleWishlist} aria-label="Add to wishlist">
            {wishlisted ? <FaHeart /> : <FaRegHeart />}
          </button>
          <button className="quick-view-float" onClick={() => setQuickView(true)}><FaEye /> Quick View</button>
        </div>

        <div className="product-info premium-product-info">
          <p className="product-category">{product.category}</p>
          <h3><Link to={`/product/${product.slug || product._id}`}>{product.name}</Link></h3>
          <p className="product-benefit">{product.shortBenefit || product.description}</p>
          <div className="product-rating-row">
            <RatingStars value={product.reviewSummary?.average || 0} />
            <span>{product.reviewSummary?.total ? `(${product.reviewSummary.total} reviews)` : "No reviews yet"}</span>
          </div>
          <div className="price-row">
            <strong>Rs. {Number(product.price).toLocaleString()}</strong>
            {product.originalPrice > product.price && <span>Rs. {Number(product.originalPrice).toLocaleString()}</span>}
          </div>
          <div className="card-actions">
            <button className="card-cart-btn" onClick={() => addToCart(product)}><FaShoppingBag /> Add to Cart</button>
            <Link className="card-detail-link" to={`/product/${product.slug || product._id}`}>View Details</Link>
          </div>
        </div>
      </article>

      {quickView && (
        <div className="quick-view-modal" role="dialog" aria-modal="true" onClick={() => setQuickView(false)}>
          <div className="quick-view-card" onClick={(e) => e.stopPropagation()}>
            <button className="quick-close" onClick={() => setQuickView(false)}>×</button>
            <div className="quick-image"><img src={product.image} alt={product.name} /></div>
            <div className="quick-content">
              <p className="product-category">{product.category}</p>
              <h2>{product.name}</h2>
              <RatingStars value={product.reviewSummary?.average || 0} />
              <p>{product.description}</p>
              <div className="detail-price">Rs. {Number(product.price).toLocaleString()}</div>
              <div className="detail-buttons">
                <button className="btn primary-btn" onClick={() => { addToCart(product); setQuickView(false); }}>Add to Cart</button>
                <Link className="btn secondary-btn" to={`/product/${product.slug || product._id}`}>Full Details</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
