import { useEffect, useState } from "react";
import api from "../api/axios.js";

const emptyForm = {
  name: "",
  category: "Organic Soap",
  price: "",
  originalPrice: "",
  description: "",
  ingredients: "",
  usage: "",
  image: "",
  stock: "",
  rating: 5,
  isFeatured: false
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    const { data } = await api.get("/api/products");
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const updateForm = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice || 0),
        stock: Number(form.stock || 0),
        rating: Number(form.rating || 5)
      };

      if (editingId) {
        await api.put(`/api/products/${editingId}`, payload);
        setMessage("Product updated.");
      } else {
        await api.post("/api/products", payload);
        setMessage("Product added.");
      }

      setForm(emptyForm);
      setEditingId(null);
      loadProducts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Product save failed.");
    } finally {
      setLoading(false);
    }
  };

  const editProduct = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      category: product.category || "Organic Soap",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      description: product.description || "",
      ingredients: product.ingredients || "",
      usage: product.usage || "",
      image: product.image || "",
      stock: product.stock || "",
      rating: product.rating || 5,
      isFeatured: product.isFeatured || false
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/api/products/${id}`);
    loadProducts();
  };

  return (
    <section className="section page-section">
      <div className="section-heading">
        <span className="section-tag">Admin</span>
        <h2>Manage Products</h2>
      </div>

      <form className="form-card admin-product-form" onSubmit={submit}>
        <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>
        {message && <p className="form-message">{message}</p>}
        <div className="form-grid">
          <input name="name" value={form.name} onChange={updateForm} placeholder="Product name" required />
          <select name="category" value={form.category} onChange={updateForm}>
            <option>Organic Soap</option>
            <option>Hair Oil</option>
            <option>Lip Balm</option>
            <option>Face Care</option>
            <option>Body Care</option>
            <option>Herbal Collection</option>
            <option>Nail Care</option>
            <option>Hand & Foot Care</option>
          </select>
          <input name="price" type="number" value={form.price} onChange={updateForm} placeholder="Price" required />
          <input name="originalPrice" type="number" value={form.originalPrice} onChange={updateForm} placeholder="Original price" />
          <input name="stock" type="number" value={form.stock} onChange={updateForm} placeholder="Stock" />
          <input name="rating" type="number" max="5" step="0.1" value={form.rating} onChange={updateForm} placeholder="Rating" />
        </div>
        <input name="image" value={form.image} onChange={updateForm} placeholder="Image URL" required />
        <textarea name="description" value={form.description} onChange={updateForm} placeholder="Description" required />
        <textarea name="ingredients" value={form.ingredients} onChange={updateForm} placeholder="Ingredients" />
        <textarea name="usage" value={form.usage} onChange={updateForm} placeholder="Usage instructions" />
        <label className="checkbox-row">
          <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={updateForm} /> Featured product
        </label>
        <button className="btn primary-btn full-btn" disabled={loading}>{loading ? "Saving..." : editingId ? "Update Product" : "Add Product"}</button>
        {editingId && <button type="button" className="btn secondary-btn full-btn" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel Edit</button>}
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td><img className="table-img" src={product.image} alt={product.name} /></td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>Rs. {product.price}</td>
                <td>{product.stock}</td>
                <td>{product.isFeatured ? "Yes" : "No"}</td>
                <td>
                  <button className="small-btn" onClick={() => editProduct(product)}>Edit</button>
                  <button className="small-btn danger" onClick={() => deleteProduct(product._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminProducts;
