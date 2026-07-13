import { useState } from "react";
import { Star } from "lucide-react";

export default function ReviewModal({ show, item, onClose, onSubmit, loading }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (!show || !item) return null;

  const handleSubmit = () => {
    onSubmit(rating, comment);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Rate & Review</h2>
        <p style={{ fontWeight: "700", marginBottom: "12px" }}>{item.name || item.title}</p>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className={s <= rating ? "filled" : ""} onClick={() => setRating(s)}>
              ★
            </span>
          ))}
        </div>
        <textarea
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          style={{ width: "100%", marginTop: "12px" }}
        />
        <div className="modal-buttons">
          <button onClick={handleSubmit} disabled={loading}>{loading ? "Submitting..." : "Submit Review"}</button>
          <button className="secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
