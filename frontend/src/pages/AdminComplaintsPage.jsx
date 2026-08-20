import { useState, useEffect } from "react";
import { AlertTriangle, Clock, CheckCircle, MessageSquare, Send, UserPlus } from "lucide-react";
import API from "../services/api";

export default function AdminComplaintsPage({ complaints, replyToComplaint, assignComplaint, loading }) {
  const [filter, setFilter] = useState("all");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState("reviewing");
  const [assigningTo, setAssigningTo] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const { data } = await API.get("/complaints/providers");
      setProviders(data.data || []);
    } catch (err) {
      console.error("Failed to load providers:", err);
    }
  };

  const filtered = filter === "all" ? complaints : complaints.filter((c) => c.status === filter);

  const handleReply = (id) => {
    if (!replyText.trim()) return;
    replyToComplaint(id, replyStatus, replyText, () => {
      setReplyingTo(null);
      setReplyText("");
      setReplyStatus("reviewing");
    });
  };

  const handleAssign = (id) => {
    if (!selectedProvider) return;
    assignComplaint(id, parseInt(selectedProvider), () => {
      setAssigningTo(null);
      setSelectedProvider("");
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
    pending: complaints.filter((c) => c.status === "pending").length,
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
            <h2>User Complaints</h2>
            <p className="muted">
              {counts.pending} pending, {counts.forwarded} forwarded, {counts.reviewing} reviewing, {counts.resolved} resolved
            </p>
          </div>
        </div>

        <div className="complaint-filter-bar">
          {["all", "pending", "forwarded", "reviewing", "resolved"].map((f) => (
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
                        {c.status === "forwarded" && <UserPlus size={12} />}
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

                  {c.assignedProviderName && (
                    <div className="complaint-admin-reply" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                      <strong>Assigned to Provider:</strong>
                      <p>{c.assignedProviderName}</p>
                      {c.assignedAt && (
                        <span style={{ fontSize: "12px", color: "#6b7280" }}>
                          Assigned on {new Date(c.assignedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )}

                  {c.providerNotes && (
                    <div className="complaint-admin-reply" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
                      <strong>Provider Notes:</strong>
                      <p>{c.providerNotes}</p>
                    </div>
                  )}

                  {c.adminReply && (
                    <div className="complaint-admin-reply">
                      <strong>Admin Response:</strong>
                      <p>{c.adminReply}</p>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
                    {replyingTo === c.id ? (
                      <div className="complaint-reply-form" style={{ width: "100%" }}>
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
                    ) : assigningTo === c.id ? (
                      <div className="complaint-reply-form" style={{ width: "100%" }}>
                        <label>Select Provider
                          <select value={selectedProvider} onChange={(e) => setSelectedProvider(e.target.value)}>
                            <option value="">Choose a provider...</option>
                            {providers.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} - {p.profession} ({p.city})
                              </option>
                            ))}
                          </select>
                        </label>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => handleAssign(c.id)} disabled={loading || !selectedProvider}>
                            <UserPlus size={14} /> {loading ? "Assigning..." : "Assign"}
                          </button>
                          <button className="secondary" onClick={() => { setAssigningTo(null); setSelectedProvider(""); }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button className="secondary" onClick={() => { setReplyingTo(c.id); setReplyText(c.adminReply || ""); }}>
                          <MessageSquare size={14} /> {c.adminReply ? "Edit Reply" : "Reply"}
                        </button>
                        {(c.status === "pending" || c.status === "forwarded") && (
                          <button className="secondary" onClick={() => { setAssigningTo(c.id); setSelectedProvider(c.assignedProviderId || ""); }}>
                            <UserPlus size={14} /> {c.assignedProviderName ? "Reassign" : "Assign to Provider"}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
