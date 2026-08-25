import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import logo from "./drm-logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-about">
          <Link className="logo footer-logo" to="/">
  <img src={logo} alt="Dr M Organics Logo" className="site-logo-img footer-logo-img" />
            <span className="logo-text">
    <strong>Dr M</strong>
    <small>Organics</small>
  </span>
</Link>
          <p>
            Premium organic skincare and haircare inspired by nature, clean beauty,
            and everyday self-care rituals.
          </p>
          <div className="footer-socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer"><FaTiktok /></a>
            <a
  href={`https://wa.me/923172200083?text=${encodeURIComponent(
    "Hi Dr M Organics, I would like to know more about your products."
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Chat with Dr M Organics on WhatsApp"
>
  <FaWhatsapp />
</a>
          </div>
        </div>

        <div>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop Products</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3>Customer Support</h3>
          <ul>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">Return Policy</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
          </ul>
        </div>

        <div>
          <h3>Contact</h3>
          <ul>
           <li>
  <a href="mailto:drmorganics6@gmail.com">
    drmorganics6@gmail.com
  </a>
</li>

<li>
  <a
    href={`https://wa.me/923172200083?text=${encodeURIComponent(
      "Hi Dr M Organics, I would like to know more about your products."
    )}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    +92 317 2200083
  </a>
</li>
            <li>Karachi, Pakistan</li>
          </ul>
        </div>
      </div>

      <div className="copyright">
        <p>© 2026 Dr M Organics. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
