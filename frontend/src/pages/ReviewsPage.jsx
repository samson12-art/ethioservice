import { Star } from "lucide-react";

export default function ReviewsPage({ reviews }) {
  return (
    <>
      <div className="panel">
        <div className="panel-title">
          <Star />
          <div>
            <h2>My Reviews</h2>
            <p className="muted">{reviews.length} review(s)</p>
          </div>
        </div>
        {reviews.length === 0 ? (
          <p className="muted" style={{ marginTop: "16px" }}>No reviews yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r._id}>
                    <td>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</td>
                    <td>{r.comment}</td>
                    <td>{new Date(r.createdAt || r._id?.toString().slice(0, 8) * 1000).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
