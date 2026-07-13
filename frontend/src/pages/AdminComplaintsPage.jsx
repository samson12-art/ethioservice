import { useState } from "react";
import { AlertTriangle, Clock, CheckCircle, MessageSquare, Send } from "lucide-react";

export default function AdminComplaintsPage({ complaints, replyToComplaint, loading }) {
  const [filter, setFilter] = useState("all");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState("reviewing");

  const filtered = filter === "all" ? complaints : complaints.filter((c) => c.status === filter);

  const handleReply = (id) => {
    if (!replyText.trim()) return;
    replyToComplaint(id, replyStatus, replyText, () => {
      setReplyingTo(null);
      setReplyText("");
      setReplyStatus("reviewing");
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

  const counts = {
    all: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    reviewing: complaints.filter((c) => c.status === "reviewing").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  };

  return (
    <div className="admin-complaints-page">
      <div className="panel">
        <div className="panel-title">
          <AlertTriangle />
          <div>
            <h2>User Complaints</h2>
            <p className="muted">{counts.pending} pending, {counts.reviewing} reviewing, {counts.resolved} resolved</p>
          </div>
        </div>

        <div className="complaint-filter-bar">
          {["all", "pending", "reviewing", "resolved"].map((f) => (
            <button
              key={f}
              className={`complaint-filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="muted" style={{ marginTop: "16px" }}>No complaints found.</p>
        ) : (
          <div className="complaints-list">
            {filtered.map((c) => {
              const sc = statusColor(c.status);
              return (
                <div key={c.id} className="complaint-card admin-complaint-card">
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
                  <div className="complaint-user-info">
                    <span><strong>User:</strong> {c.userName}</span>
                    <span><strong>Email:</strong> {c.userEmail}</span>
                  </div>
                  <h4 className="complaint-subject">{c.subject}</h4>
                  <p className="complaint-desc">{c.description}</p>

                  {c.adminReply && (
                    <div className="complaint-admin-reply">
                      <strong>Admin Response:</strong>
                      <p>{c.adminReply}</p>
                    </div>
                  )}

                  {replyingTo === c.id ? (
                    <div className="complaint-reply-form">
                      <label>Status
                        <select value={replyStatus} onChange={(e) => setReplyStatus(e.target.value)}>
                          <option value="reviewing">Reviewing</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </label>
                      <label>Reply
                        <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows="3" placeholder="Write your response..." />
                      </label>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => handleReply(c.id)} disabled={loading}>
                          <Send size={14} /> {loading ? "Sending..." : "Send Reply"}
                        </button>
                        <button className="secondary" onClick={() => setReplyingTo(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button className="secondary" style={{ marginTop: "12px" }} onClick={() => { setReplyingTo(c.id); setReplyText(c.adminReply || ""); }}>
                      <MessageSquare size={14} /> {c.adminReply ? "Edit Reply" : "Reply"}
                    </button>
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
