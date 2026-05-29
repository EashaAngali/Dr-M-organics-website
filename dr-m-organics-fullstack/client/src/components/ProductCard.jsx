import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-img-wrap">
        <img src={product.image} alt={product.name} />
        {product.originalPrice > product.price && <span className="sale-badge">Sale</span>}
      </Link>
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3><Link to={`/product/${product._id}`}>{product.name}</Link></h3>
        <div className="stars">{"★".repeat(Math.round(product.rating || 5))}</div>
        <div className="price-row">
          <strong>Rs. {product.price}</strong>
          {product.originalPrice > product.price && <span>Rs. {product.originalPrice}</span>}
        </div>
        <button onClick={() => addToCart(product)}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;
