import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import {
  FiSearch,
  FiUser,
  FiShoppingBag,
  FiMenu,
  FiX
} from "react-icons/fi";

import logo from "./drm-logo.png";

import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const { cartCount } = useCart();
  const { admin, logout } = useAuth();

  return (
    <>
      <div className="top-bar">
        <p>
          Free Delivery on Orders Above Rs. 7000 | Organic Beauty Essentials
        </p>

        <div className="top-socials">

          {/* INSTAGRAM */}
          <a
            href="https://www.instagram.com/drmorganics6?igsi=MWFrYWpsMjB6NDJuOQ=="
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>

          {/* WHATSAPP */}
          <a
            href={`https://wa.me/923172200083?text=${encodeURIComponent(
              "Hi Dr M Organics, I would like to know more about your products."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>

        </div>
      </div>

      <header className="header">
        <nav className="navbar">

          <Link className="logo" to="/">
            <img
              src={logo}
              alt="Dr M Organics Logo"
              className="site-logo-img"
            />

            <span className="logo-text">
              <strong>Dr M</strong>
              <small>Organics</small>
            </span>
          </Link>

          <ul className={open ? "nav-links active" : "nav-links"}>

            <li>
              <NavLink to="/" onClick={() => setOpen(false)}>
                Home
              </NavLink>
            </li>

            <li>
              <NavLink to="/shop" onClick={() => setOpen(false)}>
                Shop
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/shop?category=Hair Oil"
                onClick={() => setOpen(false)}
              >
                Hair Care
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/shop?category=Face Care"
                onClick={() => setOpen(false)}
              >
                Skin Care
              </NavLink>
            </li>

            {/* NEW ANALYSIS MODULE */}
            <li>
              <NavLink
                to="/analysis"
                onClick={() => setOpen(false)}
              >
                Beauty Analysis
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/about"
                onClick={() => setOpen(false)}
              >
                About
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/contact"
                onClick={() => setOpen(false)}
              >
                Contact
              </NavLink>
            </li>

            {admin && (
              <li>
                <NavLink
                  to="/admin/dashboard"
                  onClick={() => setOpen(false)}
                >
                  Admin
                </NavLink>
              </li>
            )}

          </ul>

          <div className="nav-icons">

            <Link to="/shop">
              <FiSearch />
            </Link>

            <Link to={admin ? "/admin/dashboard" : "/admin/login"}>
              <FiUser />
            </Link>

            <Link to="/cart" className="cart-icon">
              <FiShoppingBag />
              <span>{cartCount}</span>
            </Link>

            {admin && (
              <button
                className="link-button"
                onClick={logout}
              >
                Logout
              </button>
            )}

            <button
              className="menu-btn"
              onClick={() => setOpen(!open)}
            >
              {open ? <FiX /> : <FiMenu />}
            </button>

          </div>

        </nav>
      </header>
    </>
  );
};

export default Navbar;
