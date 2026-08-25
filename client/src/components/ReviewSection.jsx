import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaRegThumbsUp, FaUpload } from "react-icons/fa";
import api from "../api/axios.js";
import RatingStars from "./RatingStars.jsx";

const fileToData = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result });
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const optimizeImage = (file) => new Promise((resolve) => {
  const image = new Image();
  const url = URL.createObjectURL(file);
  image.onload = () => {
    const maxSide = 1200;
    const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/webp", 0.78);
    URL.revokeObjectURL(url);
    resolve({ name: file.name.replace(/\.[^.]+$/, ".webp"), type: "image/webp", data });
  };
  image.onerror = async () => {
    URL.revokeObjectURL(url);
    resolve(await fileToData(file));
  };
  image.src = url;
});

const ReviewSection = ({
  productId,
  onSummaryChange
}) => {

  const [searchParams] = useSearchParams();

  const openReviewForm =
    searchParams.get("writeReview") === "1";

  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ average: 0, total: 0, recommendPercent: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showForm, setShowForm] =
  useState(openReviewForm);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    name: "", email: "", rating: 5, title: "", review: "", experience: "", skinType: "", duration: "", recommend: true, photos: [], video: null
  });

  const load = async (targetPage = 1, append = false) => {
    const { data } = await api.get(`/api/reviews/product/${productId}?page=${targetPage}&limit=6`);
    setReviews((current) => append ? [...current, ...data.reviews] : data.reviews);
    setSummary(data.summary);
    setPage(data.page);
    setPages(data.pages);
    onSummaryChange?.(data.summary);
  };

useEffect(() => {

  if (!openReviewForm) return;

  setShowForm(true);

  const timer = setTimeout(() => {

    document
      .getElementById("review-form")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

  }, 250);

  return () => clearTimeout(timer);

}, [openReviewForm, productId]);
  useEffect(() => {

  if (
    window.location.hash !==
    "#reviews"
  ) {
    return;
  }

  const timer = setTimeout(() => {

    document
      .getElementById("reviews")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

  }, 250);

  return () =>
    clearTimeout(timer);

}, [productId]);

  const percentFor = (star) => summary.total ? Math.round((summary.distribution[star] / summary.total) * 100) : 0;

  const addFiles = async (fileList) => {
    const candidates = [...fileList].filter((f) => f.type.startsWith("image/")).slice(0, Math.max(0, 5 - form.photos.length));
    const tooLarge = candidates.find((f) => f.size > 6 * 1024 * 1024);
    if (tooLarge) return setMessage("Each source photo must be smaller than 6 MB.");
    const converted = await Promise.all(candidates.map(optimizeImage));
    setForm((current) => ({ ...current, photos: [...current.photos, ...converted].slice(0, 5) }));
  };

  const addVideo = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("video/") || file.size > 4 * 1024 * 1024) return setMessage("Video must be smaller than 4 MB.");
    const converted = await fileToData(file);
    setForm((current) => ({ ...current, video: converted }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const { data } = await api.post("/api/reviews", { ...form, productId, rating: Number(form.rating) });
      setMessage(data.message);
      setForm({ name: "", email: "", rating: 5, title: "", review: "", experience: "", skinType: "", duration: "", recommend: true, photos: [], video: null });
      setShowForm(false);
    } catch (error) {
      setMessage(error.response?.data?.message || "Review could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  };

  const photoReviews = useMemo(() => reviews.flatMap((review) => (review.photos || []).map((photo) => ({ photo, review }))).slice(0, 10), [reviews]);

  return (
    <section className="product-reviews" id="reviews">
      <div className="review-summary-card">
        <div className="review-score">
          <span className="eyebrow">Customer Reviews</span>
          <strong>{summary.total ? summary.average.toFixed(1) : "—"}</strong>
          <RatingStars value={summary.average} size="lg" />
          <p>{summary.total ? `Based on ${summary.total} approved review${summary.total === 1 ? "" : "s"}` : "No approved reviews yet"}</p>
          {summary.total > 0 && <p className="recommend-stat">{summary.recommendPercent}% recommend this product</p>}
        </div>
        <div className="rating-breakdown">
          {[5, 4, 3, 2, 1].map((star) => (
            <div className="rating-row" key={star}>
              <span>{star} star</span>
              <div className="rating-track"><span style={{ width: `${percentFor(star)}%` }} /></div>
              <b>{percentFor(star)}%</b>
            </div>
          ))}
        </div>
        <button className="btn primary-btn write-review-btn" onClick={() => setShowForm((value) => !value)}>Write a Review</button>
      </div>

      {message && <p className="review-message">{message}</p>}

      {showForm && (
       <form
  className="review-form"
  id="review-form"
  onSubmit={submit}
>
          <div className="review-form-head">
            <div><span className="eyebrow">Share your experience</span><h3>Write a Review</h3></div>
            <button type="button" className="text-close" onClick={() => setShowForm(false)}>Close</button>
          </div>
          <div className="form-grid">
            <input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
              <option value="5">5 stars — Excellent</option><option value="4">4 stars — Very good</option><option value="3">3 stars — Good</option><option value="2">2 stars — Fair</option><option value="1">1 star — Poor</option>
            </select>
            <input placeholder="Review title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <textarea placeholder="Detailed review *" value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} required />
          <textarea placeholder="Product experience (optional)" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
          <div className="form-grid">
            <input placeholder="Skin type (optional)" value={form.skinType} onChange={(e) => setForm({ ...form, skinType: e.target.value })} />
            <input placeholder="How long did you use it?" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </div>
          <label className="recommend-choice">Would you recommend it?
            <select value={String(form.recommend)} onChange={(e) => setForm({ ...form, recommend: e.target.value === "true" })}><option value="true">Yes</option><option value="false">No</option></select>
          </label>

          <div className="upload-grid">
            <label className="drop-upload" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}>
              <FaUpload /><strong>Add photos</strong><span>Drag & drop up to 5 images; large photos are optimized automatically</span>
              <input type="file" accept="image/*" multiple onChange={(e) => addFiles(e.target.files)} />
            </label>
            <label className="drop-upload"><FaUpload /><strong>Optional video</strong><span>MP4/web video up to 4 MB</span><input type="file" accept="video/*" onChange={(e) => addVideo(e.target.files[0])} /></label>
          </div>

          {!!form.photos.length && <div className="upload-previews">{form.photos.map((photo, index) => <div key={`${photo.name}-${index}`}><img src={photo.data} alt="Review preview" /><button type="button" onClick={() => setForm({ ...form, photos: form.photos.filter((_, i) => i !== index) })}>×</button></div>)}</div>}
          {form.video && <p className="file-pill">Video selected: {form.video.name} <button type="button" onClick={() => setForm({ ...form, video: null })}>Remove</button></p>}
          <p className="moderation-note">Reviews are checked by Dr M Organics before they appear publicly.</p>
          <button className="btn primary-btn" disabled={submitting}>{submitting ? "Submitting..." : "Submit Review"}</button>
        </form>
      )}

      {photoReviews.length > 0 && (
        <div className="customer-gallery-section">
          <div className="section-heading compact"><span className="section-tag">Real Customers. Real Experiences.</span><h2>Real Results From Our Customers</h2></div>
          <div className="customer-photo-strip">
            {photoReviews.map(({ photo, review }, index) => <button key={`${review._id}-${index}`} onClick={() => setPreview({ photo, review })}><img src={photo.data} alt={`Customer result by ${review.name}`} loading="lazy" /></button>)}
          </div>
        </div>
      )}

      <div className="approved-reviews">
        {reviews.length === 0 ? <div className="empty-review-state"><h3>Be the first to share your experience</h3><p>Approved customer reviews will appear here.</p></div> : reviews.map((item) => (
          <article className="customer-review-card" key={item._id}>
            <div className="review-card-top">
              <div><strong>{item.name}</strong>{item.verifiedPurchase && <span className="verified-badge"><FaCheckCircle /> Verified Purchase</span>}</div>
              <time>{new Date(item.createdAt).toLocaleDateString()}</time>
            </div>
            <RatingStars value={item.rating} />
            <h3>{item.title}</h3>
            <p>{item.review}</p>
            {(item.skinType || item.duration) && <div className="review-meta">{item.skinType && <span>Skin Type: {item.skinType}</span>}{item.duration && <span>Used For: {item.duration}</span>}</div>}
            {!!item.photos?.length && <div className="review-photos">{item.photos.map((photo, index) => <button key={index} onClick={() => setPreview({ photo, review: item })}><img src={photo.data} alt="Customer uploaded review" loading="lazy" /></button>)}</div>}
            {item.video?.data && <video className="review-video" controls preload="metadata" src={item.video.data} />}
            {item.adminReply && <div className="brand-reply"><strong>Dr M Organics</strong><p>{item.adminReply}</p></div>}
            <div className="review-actions"><button onClick={async () => { const { data } = await api.post(`/api/reviews/${item._id}/helpful`); setReviews((current) => current.map((r) => r._id === item._id ? { ...r, helpfulCount: data.helpfulCount } : r)); }}><FaRegThumbsUp /> Helpful ({item.helpfulCount || 0})</button><button onClick={async () => { await api.post(`/api/reviews/${item._id}/report`); setMessage("Review reported for moderation."); }}>Report Review</button></div>
          </article>
        ))}
      </div>

      {page < pages && <div className="load-more-wrap"><button className="btn secondary-btn" onClick={() => load(page + 1, true)}>Load More Reviews</button></div>}

      {preview && <div className="lightbox review-lightbox" onClick={() => setPreview(null)}><button className="lightbox-close">×</button><div className="review-lightbox-card" onClick={(e) => e.stopPropagation()}><img src={preview.photo.data} alt="Customer result" /><div><RatingStars value={preview.review.rating} /><h3>{preview.review.title}</h3><p>{preview.review.review}</p><strong>{preview.review.name}</strong></div></div></div>}
    </section>
  );
};

export default ReviewSection;
