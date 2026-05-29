import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaLeaf, FaSeedling, FaSpa, FaStar } from "react-icons/fa";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";

const categories = [
  "Organic Soap",
  "Hair Oil",
  "Lip Balm",
  "Face Care",
  "Body Care",
  "Herbal Collection"
];

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
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadFeatured = async () => {
      const { data } = await api.get("/api/products?featured=true");
      setFeatured(data.slice(0, 6));
    };
    loadFeatured();
  }, []);

  const subscribe = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/api/newsletter", { email: newsletterEmail });
      setNewsletterEmail("");
      setMessage("Subscribed successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Subscription failed.");
    }
  };

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="section-tag">Organic Beauty Rituals</span>
          <h1>Glow Naturally with Dr M Organics</h1>
          <p>
            Soft organic skincare, herbal haircare, and everyday beauty essentials
            crafted with nature-inspired ingredients.
          </p>
          <div className="hero-buttons">
            <Link className="btn primary-btn" to="/shop">Shop Now</Link>
            <Link className="btn secondary-btn" to="/about">Explore Brand</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="product-mockup mockup-one"><span>Dr M</span><h3>Rose Glow Soap</h3></div>
          <div className="product-mockup mockup-two"><span>Dr M</span><h3>Herbal Hair Oil</h3></div>
          <div className="floating-card"><FaSeedling /><p>Plant-based care</p></div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="section-tag">Browse Collection</span>
          <h2>Shop by Category</h2>
          <p>Choose your daily clean beauty essentials.</p>
        </div>
        <div className="category-grid">
          {categories.map((cat, index) => (
            <Link to={`/shop?category=${encodeURIComponent(cat)}`} className="category-card" key={cat}>
              <div className={`category-circle category-${index + 1}`}><FaLeaf /></div>
              <h3>{cat}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="promo-banner">
        <div>
          <span className="section-tag">Naturally Beautiful</span>
          <h2>Reveal Naturally Healthy Skin</h2>
          <p>Discover botanical products made for fresh, soft, and radiant-looking skin.</p>
          <Link to="/shop" className="btn primary-btn">View Collection</Link>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="section-tag">Best Sellers</span>
          <h2>Featured Products</h2>
          <p>Premium organic beauty essentials for daily use.</p>
        </div>
        <div className="product-grid">
          {featured.map((product) => <ProductCard product={product} key={product._id} />)}
        </div>
      </section>

      <section className="section concern-section">
        <div className="section-heading">
          <span className="section-tag">Targeted Care</span>
          <h2>Shop by Concern</h2>
          <p>Find products according to your skincare and haircare needs.</p>
        </div>
        <div className="concern-grid">
          {concerns.map((concern) => (
            <Link to={`/shop?search=${encodeURIComponent(concern)}`} className="concern-card" key={concern}>
              <FaSpa />
              <h3>{concern}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="section reviews-section">
        <div className="section-heading">
          <span className="section-tag">Customer Love</span>
          <h2>Reviews</h2>
        </div>
        <div className="review-grid">
          {["Beautiful packaging and the soap feels gentle.", "Hair oil has a premium herbal feel.", "Fast response and nice product collection."].map((text) => (
            <div className="review-card" key={text}>
              <div className="stars"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
              <p>{text}</p>
              <strong>Verified Customer</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="section-tag">@drmorganics</span>
          <h2>Organic Beauty Inspiration</h2>
          <p>Product routines, natural ingredients, and skincare moments.</p>
        </div>
        <div className="masonry-grid">
          {gallery.map((img, index) => (
            <div className={`gallery-item ${index === 0 || index === 4 ? "tall" : ""} ${index === 2 ? "wide" : ""}`} key={img}>
              <img src={img} alt="Dr M Organics gallery" />
            </div>
          ))}
        </div>
      </section>

      <section className="newsletter">
        <div className="newsletter-content">
          <span className="section-tag">Join Our Glow Club</span>
          <h2>Get skincare tips and exclusive offers</h2>
          <p>Subscribe for product updates, beauty routines, and special discounts.</p>
          <form onSubmit={subscribe}>
            <input value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} type="email" placeholder="Enter your email address" required />
            <button type="submit">Subscribe</button>
          </form>
          {message && <p className="form-message">{message}</p>}
        </div>
      </section>
    </>
  );
};

export default Home;
