import { useState } from "react";
import api from "../api/axios.js";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const updateForm = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);
    try {
      await api.post("/api/contact", form);
      setForm({ name: "", email: "", phone: "", message: "" });
      setStatus("Message sent successfully.");
    } catch (error) {
      setStatus(error.response?.data?.message || "Message could not be sent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section page-section">
      <div className="section-heading">
        <span className="section-tag">Contact</span>
        <h2>Talk to Dr M Organics</h2>
        <p>Send your product question, order query, or wholesale inquiry.</p>
      </div>

      <div className="contact-layout">
        <form className="form-card" onSubmit={submit}>
          <input name="name" value={form.name} onChange={updateForm} placeholder="Your name" required />
          <input name="email" value={form.email} onChange={updateForm} type="email" placeholder="Your email" required />
          <input name="phone" value={form.phone} onChange={updateForm} placeholder="Phone / WhatsApp" />
          <textarea name="message" value={form.message} onChange={updateForm} placeholder="Your message" required />
          <button className="btn primary-btn full-btn" disabled={loading}>{loading ? "Sending..." : "Send Message"}</button>
          {status && <p className="form-message">{status}</p>}
        </form>

        <div className="contact-card">
          <h3>Contact Details</h3>
          <p><strong>Email:</strong> drmorganics6@gmail.com</p>
          <p><strong>WhatsApp:</strong> +92 3172200083</p>
          <p><strong>Location:</strong> Karachi, Pakistan</p>
          <a className="btn secondary-btn" href="https://wa.me/923172200083" target="_blank" rel="noreferrer">Chat on WhatsApp</a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
