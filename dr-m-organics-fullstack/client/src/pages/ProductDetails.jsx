import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) return <section className="section"><p>Loading product...</p></section>;
  if (!product) return <section className="section"><p>Product not found.</p><Link to="/shop">Back to Shop</Link></section>;

  return (
    <section className="section page-section">
      <div className="product-detail">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-detail-content">
          <p className="product-category">{product.category}</p>
          <h1>{product.name}</h1>
          <div className="stars">{"★".repeat(Math.round(product.rating || 5))}</div>
          <div className="detail-price">Rs. {product.price}</div>
          {product.originalPrice > product.price && <p className="original-price">Rs. {product.originalPrice}</p>}
          <p>{product.description}</p>

          <div className="detail-box">
            <h3>Ingredients</h3>
            <p>{product.ingredients || "Natural botanical ingredients."}</p>
          </div>
          <div className="detail-box">
            <h3>How to Use</h3>
            <p>{product.usage || "Use as directed on product label."}</p>
          </div>

          <div className="quantity-row">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>

          <div className="detail-buttons">
            <button className="btn primary-btn" onClick={() => addToCart(product, quantity)}>Add to Cart</button>
            <button
              className="btn secondary-btn"
              onClick={() => {
                addToCart(product, quantity);
                navigate("/checkout");
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
