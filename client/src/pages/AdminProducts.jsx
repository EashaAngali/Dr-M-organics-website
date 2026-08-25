import { useEffect, useState } from "react";
import api from "../api/axios.js";

const emptyForm = {
  name: "", category: "Organic Soap", price: "", originalPrice: "", description: "", shortBenefit: "", benefits: "", ingredients: "", usage: "", suitableFor: "", precautions: "", image: "", imagesText: "", size: "", badge: "", stock: "", isFeatured: false
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => { const { data } = await api.get("/api/products"); setProducts(data); };
  useEffect(() => { loadProducts(); }, []);

  const updateForm = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setMessage("");
    try {
      const payload = {
        ...form,
        images: form.imagesText.split(/\n|,/).map((value) => value.trim()).filter(Boolean),
        price: Number(form.price), originalPrice: Number(form.originalPrice || 0), stock: Number(form.stock || 0)
      };
      delete payload.imagesText;
      if (editingId) { await api.put(`/api/products/${editingId}`, payload); setMessage("Product updated."); }
      else { await api.post("/api/products", payload); setMessage("Product added."); }
      setForm(emptyForm); setEditingId(null); loadProducts();
    } catch (error) { setMessage(error.response?.data?.message || "Product save failed."); }
    finally { setLoading(false); }
  };

  const editProduct = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "", category: product.category || "Organic Soap", price: product.price || "", originalPrice: product.originalPrice || "", description: product.description || "", shortBenefit: product.shortBenefit || "", benefits: product.benefits || "", ingredients: product.ingredients || "", usage: product.usage || "", suitableFor: product.suitableFor || "", precautions: product.precautions || "", image: product.image || "", imagesText: (product.images || []).join("\n"), size: product.size || "", badge: product.badge || "", stock: product.stock || "", isFeatured: product.isFeatured || false
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => { if (!confirm("Delete this product?")) return; await api.delete(`/api/products/${id}`); loadProducts(); };

  return (
    <section className="section page-section">
      <div className="section-heading"><span className="section-tag">Admin</span><h2>Manage Products</h2><p>Product imagery now supports a main image plus multiple gallery images.</p></div>
      <form className="form-card admin-product-form" onSubmit={submit}>
        <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>{message && <p className="form-message">{message}</p>}
        <div className="form-grid">
          <input name="name" value={form.name} onChange={updateForm} placeholder="Product name" required />
          <select name="category" value={form.category} onChange={updateForm}><option>Organic Soap</option><option>Hair Oil</option><option>Lip Balm</option><option>Face Care</option><option>Body Care</option><option>Herbal Collection</option><option>Nail Care</option><option>Hand & Foot Care</option></select>
          <input name="price" type="number" value={form.price} onChange={updateForm} placeholder="Price" required />
          <input name="originalPrice" type="number" value={form.originalPrice} onChange={updateForm} placeholder="Original price" />
          <input name="stock" type="number" value={form.stock} onChange={updateForm} placeholder="Stock" />
          <input name="size" value={form.size} onChange={updateForm} placeholder="Size / variant e.g. 100 ml" />
          <select name="badge" value={form.badge} onChange={updateForm}><option value="">No badge</option><option>Best Seller</option><option>New</option><option>Trending</option></select>
        </div>
        <input name="image" value={form.image} onChange={updateForm} placeholder="Main image URL" required />
        <textarea name="imagesText" value={form.imagesText} onChange={updateForm} placeholder="Additional image URLs — one per line" />
        <input name="shortBenefit" value={form.shortBenefit} onChange={updateForm} placeholder="Short benefit line e.g. Hydration • Brightening • Soft Skin" />
        <textarea name="description" value={form.description} onChange={updateForm} placeholder="Description" required />
        <textarea name="benefits" value={form.benefits} onChange={updateForm} placeholder="Key benefits" />
        <textarea name="ingredients" value={form.ingredients} onChange={updateForm} placeholder="Ingredients" />
        <textarea name="usage" value={form.usage} onChange={updateForm} placeholder="How to use" />
        <textarea name="suitableFor" value={form.suitableFor} onChange={updateForm} placeholder="Suitable for" />
        <textarea name="precautions" value={form.precautions} onChange={updateForm} placeholder="Precautions" />
        <label className="checkbox-row"><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={updateForm} /> Featured product</label>
        <button className="btn primary-btn full-btn" disabled={loading}>{loading ? "Saving..." : editingId ? "Update Product" : "Add Product"}</button>
        {editingId && <button type="button" className="btn secondary-btn full-btn" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel Edit</button>}
      </form>
      <div className="table-wrap"><table><thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product._id}><td><img className="table-img" src={product.image} alt={product.name} /></td><td>{product.name}</td><td>{product.category}</td><td>Rs. {product.price}</td><td>{product.stock}</td><td>{product.isFeatured ? "Yes" : "No"}</td><td><button className="small-btn" onClick={() => editProduct(product)}>Edit</button><button className="small-btn danger" onClick={() => deleteProduct(product._id)}>Delete</button></td></tr>)}</tbody></table></div>
    </section>
  );
};

export default AdminProducts;
