import { useState } from "react";
import { AlertTriangle, Clock, CheckCircle, MessageSquare, Send, UserPlus } from "lucide-react";

export default function ProviderComplaintsPage({ complaints, updateProviderNotes, loading }) {
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [notesText, setNotesText] = useState("");
  const [noteStatus, setNoteStatus] = useState("reviewing");

  const filtered = filter === "all" ? complaints : complaints.filter((c) => c.status === filter);

  const handleUpdate = (id) => {
    if (!notesText.trim()) return;
    updateProviderNotes(id, notesText, noteStatus, () => {
      setEditingId(null);
      setNotesText("");
      setNoteStatus("reviewing");
    });
  };

  const statusColor = (status) => {
    switch (status) {
      case "pending": return { bg: "#fef9e7", text: "#b45309", border: "#fde68a" };
      case "forwarded": return { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" };
      case "reviewing": return { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" };
      case "resolved": return { bg: "#ecfdf5", text: "#047857", border: "#a7f3d0" };
      default: return { bg: "#f3f4f6", text: "#6b7280", border: "#e5e7eb" };
    }
  };

  const counts = {
    all: complaints.length,
    forwarded: complaints.filter((c) => c.status === "forwarded").length,
    reviewing: complaints.filter((c) => c.status === "reviewing").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  };

  return (
    <div className="admin-complaints-page">
      <div className="panel">
        <div className="panel-title">
          <AlertTriangle />
          <div>
            <h2>Assigned Complaints</h2>
            <p className="muted">
              Complaints forwarded by admin for your follow-up
            </p>
          </div>
        </div>

        <div className="complaint-filter-bar">
          {["all", "forwarded", "reviewing", "resolved"].map((f) => (
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
          <p className="muted" style={{ marginTop: "16px" }}>No complaints assigned to you.</p>
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
                        {c.status === "forwarded" && <UserPlus size={12} />}
                        {c.status === "reviewing" && <MessageSquare size={12} />}
                        {c.status === "resolved" && <CheckCircle size={12} />}
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </span>
                    </div>
                    <span className="complaint-date">
                      {c.assignedAt ? `Assigned: ${new Date(c.assignedAt).toLocaleDateString()}` : new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="complaint-user-info">
                    <span><strong>From User:</strong> {c.userName}</span>
                    <span><strong>Email:</strong> {c.userEmail}</span>
                  </div>
                  <h4 className="complaint-subject">{c.subject}</h4>
                  <p className="complaint-desc">{c.description}</p>

                  {c.adminReply && (
                    <div className="complaint-admin-reply">
                      <strong>Admin Note:</strong>
                      <p>{c.adminReply}</p>
                    </div>
                  )}

                  {c.providerNotes && (
                    <div className="complaint-admin-reply" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
                      <strong>Your Previous Notes:</strong>
                      <p>{c.providerNotes}</p>
                    </div>
                  )}

                  {editingId === c.id ? (
                    <div className="complaint-reply-form">
                      <label>Update Status
                        <select value={noteStatus} onChange={(e) => setNoteStatus(e.target.value)}>
                          <option value="forwarded">Forwarded</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </label>
                      <label>Follow-up Notes
                        <textarea
                          value={notesText}
                          onChange={(e) => setNotesText(e.target.value)}
                          rows="3"
                          placeholder="Describe the actions taken or resolution..."
                        />
                      </label>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => handleUpdate(c.id)} disabled={loading}>
                          <Send size={14} /> {loading ? "Saving..." : "Save Update"}
                        </button>
                        <button className="secondary" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="secondary"
                      style={{ marginTop: "12px" }}
                      onClick={() => {
                        setEditingId(c.id);
                        setNotesText(c.providerNotes || "");
                        setNoteStatus(c.status);
                      }}
                    >
                      <MessageSquare size={14} /> {c.providerNotes ? "Update Follow-up" : "Add Follow-up Notes"}
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
