import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaLeaf, FaSeedling, FaSpa, FaCheckCircle } from "react-icons/fa";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import RatingStars from "../components/RatingStars.jsx";

const categories = ["Organic Soap", "Hair Oil", "Lip Balm", "Face Care", "Body Care", "Herbal Collection"];
const concerns = ["Acne Care", "Dry Skin", "Dark Spots", "Hair Fall", "Pigmentation", "Dull Skin"];
const gallery = [
  "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80"
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [featuredReviews, setFeaturedReviews] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/api/products?featured=true"),
      api.get("/api/reviews/public?limit=6")
    ]).then(([productsResponse, reviewsResponse]) => {
      setFeatured(productsResponse.data.slice(0, 6));
      setFeaturedReviews(
  reviewsResponse.data.reviews || []
);
    }).catch(() => {});
  }, []);

  const customerPhotos = useMemo(() => featuredReviews.flatMap((review) => (review.photos || []).map((photo) => ({ photo, review }))).slice(0, 8), [featuredReviews]);

  const subscribe = async (e) => {
    e.preventDefault(); setMessage("");
    try { await api.post("/api/newsletter", { email: newsletterEmail }); setNewsletterEmail(""); setMessage("Subscribed successfully."); }
    catch (error) { setMessage(error.response?.data?.message || "Subscription failed."); }
  };

  return (
    <>
      <section className="hero premium-hero">
        <div className="hero-content">
          <span className="section-tag">Botanical beauty, thoughtfully made</span>
          <h1>Modern care for your everyday glow.</h1>
          <p>Organic-inspired skincare, haircare, and beauty essentials presented with a calmer, more premium Dr M Organics experience.</p>
          <div className="hero-buttons"><Link className="btn primary-btn" to="/shop">Shop the Collection</Link><Link className="btn secondary-btn" to="/about">Our Story</Link></div>
          <div className="hero-trust-line"><span><FaCheckCircle /> Clean presentation</span><span><FaCheckCircle /> Nationwide delivery</span><span><FaCheckCircle /> Genuine review system</span></div>
        </div>
        <div className="hero-visual">
          <div className="product-mockup mockup-one"><span>Dr M</span><h3>Rose Glow Ritual</h3></div>
          <div className="product-mockup mockup-two"><span>Dr M</span><h3>Botanical Hair Care</h3></div>
          <div className="floating-card"><FaSeedling /><p>Plant-inspired care</p></div>
        </div>
      </section>

      <section className="section"><div className="section-heading"><span className="section-tag">Browse Collection</span><h2>Shop by Category</h2><p>Find the ritual that fits your routine.</p></div><div className="category-grid">{categories.map((cat, index) => <Link to={`/shop?category=${encodeURIComponent(cat)}`} className="category-card" key={cat}><div className={`category-circle category-${index + 1}`}><FaLeaf /></div><h3>{cat}</h3></Link>)}</div></section>

      <section className="promo-banner"><div><span className="section-tag">Naturally Beautiful</span><h2>Small rituals. Softer skin. A more considered routine.</h2><p>Discover Dr M Organics essentials designed for a refined, easy-to-shop skincare experience.</p><Link to="/shop" className="btn primary-btn">View Collection</Link></div></section>

      <section className="section"><div className="section-heading"><span className="section-tag">Best Sellers</span><h2>Featured Products</h2><p>Clean cards, consistent imagery, and product information that is easier to compare.</p></div><div className="product-grid">{featured.map((product) => <ProductCard product={product} key={product._id} />)}</div></section>

      <section className="section concern-section"><div className="section-heading"><span className="section-tag">Targeted Care</span><h2>Shop by Concern</h2><p>Explore the collection by skincare and haircare goals.</p></div><div className="concern-grid">{concerns.map((concern) => <Link to={`/shop?search=${encodeURIComponent(concern)}`} className="concern-card" key={concern}><FaSpa /><h3>{concern}</h3></Link>)}</div></section>

      <section className="section community-reviews-section">

  <div className="community-reviews-shell">

    <div className="community-section-header">

      <div>

        <span className="section-tag">
          Loved by Our Community
        </span>

        <h2>
          Customer Experiences
        </h2>

        <p>
          Genuine reviews shared by customers
          who have experienced Dr M Organics
          products.
        </p>

      </div>

      <Link
        to="/reviews"
        className="reviews-header-link"
      >
        Read All Reviews →
      </Link>

    </div>

    {featuredReviews.length > 0 ? (

      <div className="featured-review-slider">

        {featuredReviews
          .slice(0, 6)
          .map((review) => (

            <article
              className="community-review-card"
              key={review._id}
            >

              <div className="community-review-top">

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

              <div className="community-quote">
                “
              </div>

              <p className="community-review-text">
                {review.review}
              </p>

              <div className="community-review-author">

                <div>

                  <strong>
                    {review.name}
                  </strong>

                  <span>
                    {review.product?.name ||
                      "Dr M Organics Customer"}
                  </span>

                </div>

              </div>

              {review.product?._id && (

                <Link
                  to={`/product/${review.product._id}#reviews`}
                  className="community-product-link"
                >
                  Read Product Review →
                </Link>

              )}

            </article>

          ))}

      </div>

    ) : (

      <div className="empty-review-state">

        <h3>
          Customer reviews coming soon
        </h3>

        <p>
          Approved customer experiences
          will appear here.
        </p>

      </div>

    )}

    <div className="customer-review-actions">

      <Link
        to="/reviews"
        className="btn secondary-btn"
      >
        Read Product Reviews
      </Link>

      <Link
        to="/write-review"
        className="btn primary-btn"
      >
        Share Your Experience
      </Link>

    </div>

  </div>

</section>

      {customerPhotos.length > 0 && <section className="section homepage-customer-gallery"><div className="section-heading"><span className="section-tag">Real Customers. Real Experiences.</span><h2>Your Glow, Your Story</h2><p>Approved customer photos shared through product reviews.</p></div><div className="home-customer-photo-grid">{customerPhotos.map(({ photo, review }, index) => <div key={`${review._id}-${index}`}><img src={photo.data} alt={`Dr M Organics customer experience by ${review.name}`} loading="lazy" /><span>{review.product?.name}</span></div>)}</div></section>}

      <section className="story-cta">

  <div className="story-cta-inner">

    <div className="story-cta-copy">

      <span className="section-tag">
        Your Glow, Your Story
      </span>

      <h2>
        Used a Dr M Organics product?
        Tell us how it went.
      </h2>

      <p>
        Share an honest rating, your experience,
        and optional photos or video.
        Your review is submitted for moderation
        before it appears publicly.
      </p>

      <div className="story-cta-points">

        <span>
          <FaCheckCircle />
          Choose the product you used
        </span>

        <span>
          <FaCheckCircle />
          Add rating, review & photos
        </span>

        <span>
          <FaCheckCircle />
          Submitted as a customer review
        </span>

      </div>

      <Link
        to="/write-review"
        className="btn primary-btn story-cta-btn"
      >
        Share Your Experience
      </Link>

    </div>

    <div
      className="story-cta-card"
      aria-hidden="true"
    >

      <div className="story-quote-mark">
        “
      </div>

      <div className="story-stars">
        ★★★★★
      </div>

      <p>
        Your experience can help another
        customer choose with confidence.
      </p>

      <span>
        Real Customers • Real Experiences
      </span>

    </div>

  </div>

</section>

      <section className="section"><div className="section-heading"><span className="section-tag">@drmorganics</span><h2>Organic Beauty Inspiration</h2><p>Product rituals, botanical textures, and skincare moments.</p></div><div className="masonry-grid">{gallery.map((img, index) => <div className={`gallery-item ${index === 0 || index === 4 ? "tall" : ""} ${index === 2 ? "wide" : ""}`} key={img}><img src={img} alt="Dr M Organics beauty inspiration" loading="lazy" /></div>)}</div></section>

      <section className="newsletter"><div className="newsletter-content"><span className="section-tag">Join Our Glow Club</span><h2>Skincare notes and special offers</h2><p>Subscribe for product updates, beauty routines, and Dr M Organics news.</p><form onSubmit={subscribe}><input value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} type="email" placeholder="Enter your email address" required /><button type="submit">Subscribe</button></form>{message && <p className="form-message">{message}</p>}</div></section>
    </>
  );
};

export default Home;
