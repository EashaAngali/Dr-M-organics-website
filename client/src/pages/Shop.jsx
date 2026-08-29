import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";

const categories = [
  "All",
  "Organic Soap",
  "Hair Oil",
  "Lip Balm",
  "Face Care",
  "Body Care",
  "Herbal Collection",
  "Nail Care",
  "Hand & Foot Care"
];

const Shop = () => {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedCategory = params.get("category") || "All";
  const search = params.get("search") || "";

  const queryString = useMemo(() => {
    const q = new URLSearchParams();
    if (selectedCategory !== "All") q.set("category", selectedCategory);
    if (search) q.set("search", search);
    return q.toString();
  }, [selectedCategory, search]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/api/products${queryString ? `?${queryString}` : ""}`);
        setProducts(data);
      } catch (error) {
        setError("Products could not be loaded.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [queryString]);

  const updateCategory = (category) => {
    const q = new URLSearchParams(params);
    category === "All" ? q.delete("category") : q.set("category", category);
    setParams(q);
  };

  const updateSearch = (value) => {
    const q = new URLSearchParams(params);
    value ? q.set("search", value) : q.delete("search");
    setParams(q);
  };

  return (
    <section className="section page-section">
      <div className="section-heading">
        <span className="section-tag">Shop</span>
        <h2>Dr M Organics Collection</h2>
        <p>Browse organic skincare, haircare, and herbal beauty essentials.</p>
      </div>

      <div className="shop-controls">
        <input value={search} onChange={(e) => updateSearch(e.target.value)} placeholder="Search products..." />
        <select value={selectedCategory} onChange={(e) => updateCategory(e.target.value)}>
          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {loading && <p className="center-text">Loading products...</p>}
      {error && <p className="error-text">{error}</p>}
     {!loading && !products.length && (
  <div className="coming-soon-products">

    <span className="section-tag">
      Dr M Organics
    </span>

    <h3>
      Coming Soon
    </h3>

    <p>
      Something special is being prepared for this collection.
      Our new products will be available soon.
    </p>

  </div>
)}

      <div className="product-grid">
        {products.map((product) => <ProductCard product={product} key={product._id} />)}
      </div>
    </section>
  );
};

export default Shop;
