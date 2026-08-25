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
       {/* PRODUCT IMAGES */}
<div className="admin-form-section">
  <div className="admin-form-section-head">
    <span>01</span>

    <div>
      <h4>Product Images</h4>
      <p>
        Add the main product image and optional gallery images.
      </p>
    </div>
  </div>

  <div className="admin-field">
    <label>Main Product Image URL *</label>

    <input
      name="image"
      value={form.image}
      onChange={updateForm}
      placeholder="https://example.com/product-image.webp"
      required
    />
  </div>

  <div className="admin-field">
    <label>Additional Product Images</label>

    <textarea
      name="imagesText"
      value={form.imagesText}
      onChange={updateForm}
      placeholder={`Paste one image URL per line

Example:
https://example.com/front.webp
https://example.com/back.webp
https://example.com/texture.webp`}
    />

    <small>
      Add one image URL per line. These images will appear in
      the product gallery.
    </small>
  </div>
</div>


{/* PRODUCT SUMMARY */}
<div className="admin-form-section">

  <div className="admin-form-section-head">
    <span>02</span>

    <div>
      <h4>Product Summary</h4>
      <p>
        Add the short selling message shown near the product name.
      </p>
    </div>
  </div>

  <div className="admin-field">
    <label>Short Benefit Line</label>

    <input
      name="shortBenefit"
      value={form.shortBenefit}
      onChange={updateForm}
      placeholder="Hydration • Brightening • Soft Skin"
    />

    <small>
      Keep this short. It appears as a quick benefit summary.
    </small>
  </div>

</div>


{/* PRODUCT CONTENT */}
<div className="admin-form-section product-content-section">

  <div className="admin-form-section-head">
    <span>03</span>

    <div>
      <h4>Product Information</h4>

      <p>
        This content appears on the individual product page.
      </p>
    </div>
  </div>


  <div className="admin-field full-content-field">
    <label>
      Product Description <em>Required</em>
    </label>

    <textarea
      className="admin-large-textarea"
      name="description"
      value={form.description}
      onChange={updateForm}
      placeholder="Describe the product, what it does, texture, formulation and the main reason customers should use it..."
      required
    />

    <small>
      Write a clear product overview. Avoid putting ingredients
      or usage instructions here.
    </small>
  </div>


  <div className="admin-content-grid">

    <div className="admin-field">
      <label>Key Benefits</label>

      <textarea
        name="benefits"
        value={form.benefits}
        onChange={updateForm}
        placeholder={`Example:
Brightens dull-looking skin
Supports hydration
Leaves skin soft and smooth`}
      />

      <small>
        Add one benefit per line for cleaner presentation.
      </small>
    </div>


    <div className="admin-field">
      <label>Key Ingredients</label>

      <textarea
        name="ingredients"
        value={form.ingredients}
        onChange={updateForm}
        placeholder={`Example:
Niacinamide
Aloe Vera
Vitamin E
Licorice Extract`}
      />

      <small>
        List the important ingredients customers should know.
      </small>
    </div>


    <div className="admin-field">
      <label>How to Use</label>

      <textarea
        name="usage"
        value={form.usage}
        onChange={updateForm}
        placeholder="Explain when, where and how much product should be applied..."
      />

      <small>
        Keep the instructions simple and practical.
      </small>
    </div>


    <div className="admin-field">
      <label>Suitable For</label>

      <textarea
        name="suitableFor"
        value={form.suitableFor}
        onChange={updateForm}
        placeholder={`Example:
Normal skin
Dry skin
Combination skin
Daily skincare routine`}
      />

      <small>
        Mention relevant skin/hair types or customer groups.
      </small>
    </div>


    <div className="admin-field admin-precaution-field">
      <label>Precautions</label>

      <textarea
        name="precautions"
        value={form.precautions}
        onChange={updateForm}
        placeholder={`Example:
For external use only.
Patch test before first use.
Avoid direct contact with eyes.`}
      />

      <small>
        Add important product-use precautions.
      </small>
    </div>

  </div>

</div>
        <label className="checkbox-row"><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={updateForm} /> Featured product</label>
        <button className="btn primary-btn full-btn" disabled={loading}>{loading ? "Saving..." : editingId ? "Update Product" : "Add Product"}</button>
        {editingId && <button type="button" className="btn secondary-btn full-btn" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel Edit</button>}
      </form>
      <div className="table-wrap"><table><thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product._id}><td><img className="table-img" src={product.image} alt={product.name} /></td><td>{product.name}</td><td>{product.category}</td><td>Rs. {product.price}</td><td>{product.stock}</td><td>{product.isFeatured ? "Yes" : "No"}</td><td><button className="small-btn" onClick={() => editProduct(product)}>Edit</button><button className="small-btn danger" onClick={() => deleteProduct(product._id)}>Delete</button></td></tr>)}</tbody></table></div>
    </section>
  );
};

export default AdminProducts;
