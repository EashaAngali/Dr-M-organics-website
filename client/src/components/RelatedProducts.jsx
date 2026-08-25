import { useEffect, useState } from "react";
import api from "../api/axios.js";
import ProductCard from "./ProductCard.jsx";

const RelatedProducts = ({ product }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get(`/api/products?category=${encodeURIComponent(product.category)}`);
      setItems(data.filter((item) => item._id !== product._id).slice(0, 3));
    };
    load().catch(() => setItems([]));
  }, [product._id, product.category]);

  if (!items.length) return null;

  return (
    <section className="section related-products-section">
      <div className="section-heading compact"><span className="section-tag">You may also like</span><h2>Related Products</h2></div>
      <div className="product-grid">{items.map((item) => <ProductCard key={item._id} product={item} />)}</div>
    </section>
  );
};

export default RelatedProducts;
