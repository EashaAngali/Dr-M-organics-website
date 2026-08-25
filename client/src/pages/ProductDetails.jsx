import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle, FaHeart, FaRegHeart, FaShieldAlt, FaTruck, FaHeadset, FaFlask } from "react-icons/fa";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";
import ProductGallery from "../components/ProductGallery.jsx";
import RatingStars from "../components/RatingStars.jsx";
import ReviewSection from "../components/ReviewSection.jsx";
import RelatedProducts from "../components/RelatedProducts.jsx";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewSummary, setReviewSummary] = useState({ average: 0, total: 0, recommendPercent: 0 });
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
        setReviewSummary({
          average: data.reviewSummary?.average || 0,
          total: data.reviewSummary?.total || 0,
          recommendPercent: 0
        });
        const ids = JSON.parse(localStorage.getItem("drm_wishlist") || "[]");
        setWishlisted(ids.includes(data._id));
      } catch (error) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const oldTitle = document.title;
    document.title = `${product.name} | Dr M Organics`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = (product.description || "Shop Dr M Organics skincare and beauty products.").slice(0, 155);

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "drm-product-schema";
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: [product.image, ...(product.images || [])].filter(Boolean),
      description: product.description,
      sku: product._id,
      brand: { "@type": "Brand", name: "Dr M Organics" },
      offers: {
        "@type": "Offer",
        priceCurrency: "PKR",
        price: product.price,
        availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      }
    };
    if (reviewSummary.total > 0) {
      schema.aggregateRating = { "@type": "AggregateRating", ratingValue: reviewSummary.average, reviewCount: reviewSummary.total };
    }
    script.textContent = JSON.stringify(schema);
    document.getElementById("drm-product-schema")?.remove();
    document.head.appendChild(script);

    return () => {
      document.title = oldTitle;
      script.remove();
    };
  }, [product, reviewSummary]);

  const salePercent = useMemo(() => product && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0, [product]);

  const toggleWishlist = () => {
    const ids = JSON.parse(localStorage.getItem("drm_wishlist") || "[]");
    const next = ids.includes(product._id) ? ids.filter((value) => value !== product._id) : [...ids, product._id];
    localStorage.setItem("drm_wishlist", JSON.stringify(next));
    setWishlisted(next.includes(product._id));
  };

  if (loading) return <section className="section"><p>Loading product...</p></section>;
  if (!product) return <section className="section"><p>Product not found.</p><Link to="/shop">Back to Shop</Link></section>;

  return (
    <>
      <section className="section page-section premium-product-page">
        <nav className="product-breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/shop">Shop</Link><span>/</span><span>{product.name}</span></nav>

        <div className="product-detail premium-product-detail">
          <ProductGallery product={product} />

          <div className="product-detail-content premium-detail-content">
            <div className="detail-label-row"><p className="product-category">{product.category}</p>{product.badge && <span className="status-badge inline">{product.badge}</span>}</div>
            <h1>{product.name}</h1>
            {product.shortBenefit && <p className="detail-benefit">{product.shortBenefit}</p>}

            <div className="detail-rating-line">
              <RatingStars value={reviewSummary.average || 0} size="lg" />
              <a href="#reviews">{reviewSummary.total ? `${reviewSummary.average.toFixed(1)} | ${reviewSummary.total} Reviews` : "No approved reviews yet"}</a>
            </div>
            {reviewSummary.total > 0 && <div className="recommend-pill"><FaCheckCircle /> {reviewSummary.recommendPercent}% of customers recommend this product</div>}

            <div className="detail-pricing">
              <div className="detail-price">Rs. {Number(product.price).toLocaleString()}</div>
              {product.originalPrice > product.price && <><p className="original-price">Rs. {Number(product.originalPrice).toLocaleString()}</p><span className="discount-chip">Save {salePercent}%</span></>}
            </div>

            <p className="detail-description">{product.description}</p>

            <div className="product-options-grid">
              <div><span>Size / Variant</span><strong>{product.size || "Standard"}</strong></div>
              <div><span>Availability</span><strong className={product.stock > 0 ? "in-stock" : "out-stock"}>{product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}</strong></div>
            </div>

            <div className="purchase-row">
              <div className="quantity-row premium-quantity">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button><span>{quantity}</span><button onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}>+</button>
              </div>
              <button className="wishlist-detail" onClick={toggleWishlist}>{wishlisted ? <FaHeart /> : <FaRegHeart />} Wishlist</button>
            </div>

            <div className="detail-buttons purchase-buttons">
              <button className="btn primary-btn" disabled={product.stock <= 0} onClick={() => addToCart(product, quantity)}>Add to Cart</button>
              <button className="btn secondary-btn" disabled={product.stock <= 0} onClick={() => { addToCart(product, quantity); navigate("/checkout"); }}>Buy Now</button>
            </div>

            <div className="trust-grid">
              <div><FaFlask /><span>Carefully formulated</span></div><div><FaShieldAlt /><span>Quality ingredients</span></div><div><FaTruck /><span>Nationwide delivery</span></div><div><FaHeadset /><span>Customer support</span></div>
            </div>

            <div className="product-accordions">
              <details open><summary>Description</summary><p>{product.description}</p></details>
              <details><summary>Key Benefits</summary><p>{product.benefits || product.shortBenefit || "See product description for key benefits."}</p></details>
              <details><summary>Key Ingredients</summary><p>{product.ingredients || "Ingredient information will be updated soon."}</p></details>
              <details><summary>How to Use</summary><p>{product.usage || "Use as directed on the product label."}</p></details>
              <details><summary>Suitable For</summary><p>{product.suitableFor || "See product label or contact us for suitability guidance."}</p></details>
              <details><summary>Precautions</summary><p>{product.precautions || "For external use only. Patch test where appropriate and discontinue if irritation occurs."}</p></details>
              <details><summary>Shipping & Returns</summary><p>Nationwide delivery is available. Contact Dr M Organics support for order or return assistance.</p></details>
              <details><summary>Reviews</summary><p><a href="#reviews">Read genuine approved customer reviews below.</a></p></details>
            </div>
          </div>
        </div>
      </section>
      <ReviewSection productId={product._id} onSummaryChange={setReviewSummary} />
      <RelatedProducts product={product} />
    </>
  );
};

export default ProductDetails;
