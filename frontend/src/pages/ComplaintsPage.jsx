import { useState } from "react";
import { AlertTriangle, Send, Clock, CheckCircle, MessageSquare } from "lucide-react";

const categories = [
  "Service Quality Issue",
  "Provider Behavior",
  "Payment Problem",
  "Safety Concern",
  "Misleading Information",
  "Late / No-Show",
  "Other",
];

export default function ComplaintsPage({ complaints, submitComplaint, loading }) {
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitComplaint(category, subject, description, () => {
      setCategory("");
      setSubject("");
      setDescription("");
      setShowForm(false);
    });
  };

  const statusColor = (status) => {
    switch (status) {
      case "pending": return { bg: "#fef9e7", text: "#b45309", border: "#fde68a" };
      case "reviewing": return { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" };
      case "resolved": return { bg: "#ecfdf5", text: "#047857", border: "#a7f3d0" };
      default: return { bg: "#f3f4f6", text: "#6b7280", border: "#e5e7eb" };
    }
  };

  return (
    <div className="complaints-page">
      <div className="panel">
        <div className="panel-title">
          <AlertTriangle />
          <div>
            <h2>Complaints & Reports</h2>
            <p className="muted">Submit a complaint or report an issue to our admin team</p>
          </div>
        </div>

        {!showForm ? (
          <button className="complaint-new-btn" onClick={() => setShowForm(true)}>
            <AlertTriangle size={18} /> File a New Complaint
          </button>
        ) : (
          <div className="complaint-form-box">
            <div className="complaint-form-header">
              <h3>New Complaint</h3>
              <button className="text-button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
            <form onSubmit={handleSubmit} className="form-stack">
              <label>Category
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                  <option value="">Select a category</option>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label>Subject
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief summary of your complaint" required />
              </label>
              <label>Description
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="5" placeholder="Please describe your complaint in detail..." required />
              </label>
              <button type="submit" disabled={loading}>
                <Send size={16} /> {loading ? "Submitting..." : "Submit Complaint"}
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="panel">
        <div className="panel-title">
          <Clock />
          <div>
            <h2>My Complaints</h2>
            <p className="muted">{complaints.length} complaint(s) submitted</p>
          </div>
        </div>
        {complaints.length === 0 ? (
          <p className="muted" style={{ marginTop: "16px" }}>You haven't filed any complaints yet.</p>
        ) : (
          <div className="complaints-list">
            {complaints.map((c) => {
              const sc = statusColor(c.status);
              return (
                <div key={c.id} className="complaint-card">
                  <div className="complaint-card-header">
                    <div>
                      <span className="complaint-category-badge">{c.category}</span>
                      <span className="complaint-status-badge" style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                        {c.status === "pending" && <Clock size={12} />}
                        {c.status === "reviewing" && <MessageSquare size={12} />}
                        {c.status === "resolved" && <CheckCircle size={12} />}
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </span>
                    </div>
                    <span className="complaint-date">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="complaint-subject">{c.subject}</h4>
                  <p className="complaint-desc">{c.description}</p>
                  {c.adminReply && (
                    <div className="complaint-admin-reply">
                      <strong>Admin Response:</strong>
                      <p>{c.adminReply}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
