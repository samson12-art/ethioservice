import { useState, useEffect } from "react";
import { AlertCircle, User, Phone, Mail, MessageSquare } from "lucide-react";
import API from "../services/api";

export default function ProviderBookingsPage({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const { data } = await API.get("/bookings/provider-bookings");
      setBookings(data.data || []);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      await API.put("/bookings/status", { bookingId, status });
      loadBookings();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>Loading bookings...</div>;
  }

  return (
    <div style={{ display: "grid", gap: "22px" }}>
      <div className="filter-bar">
        {["all", "pending_payment", "confirmed", "completed", "fully_paid", "cancelled"].map(f => (
          <button
            key={f}
            className={`complaint-filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <AlertCircle size={40} />
          <p>No bookings found</p>
        </div>
      ) : (
        filtered.map(b => (
          <div key={b.id} className="booking-card">
            <div className="status-line">
              <h3>{b.itemName} ({b.serviceType})</h3>
              <span className={`badge ${b.status === 'completed' || b.status === 'fully_paid' ? 'ok' : b.status === 'cancelled' ? 'bad' : 'pending'}`}>
                {b.status?.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="customer-info-box" style={{
              background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px",
              padding: "12px", marginTop: "12px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <User size={16} color="#166534" />
                <strong style={{ color: "#166534" }}>Customer Information</strong>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", fontSize: "14px" }}>
                <span><strong>Name:</strong> {b.customerName || "N/A"}</span>
                <span><strong>ID:</strong> {b.customerId}</span>
                {b.customerEmail && (
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Mail size={12} /> {b.customerEmail}
                  </span>
                )}
                {b.customerPhone && (
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Phone size={12} /> {b.customerPhone}
                  </span>
                )}
              </div>
            </div>

            {b.description && (
              <div style={{
                background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "8px",
                padding: "12px", marginTop: "12px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <MessageSquare size={16} color="#1d4ed8" />
                  <strong style={{ color: "#1d4ed8" }}>What the Customer Needs</strong>
                </div>
                <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5" }}>{b.description}</p>
              </div>
            )}

            <div className="details" style={{ marginTop: "12px" }}>
              <div>
                <dt>Date</dt>
                <dd>{new Date(b.bookingDate).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>{b.time}</dd>
              </div>
              <div>
                <dt>Mode</dt>
                <dd>{b.bookingMode}</dd>
              </div>
              <div>
                <dt>Total Price</dt>
                <dd>{Math.round(b.totalPrice)} Br</dd>
              </div>
              <div>
                <dt>Payment</dt>
                <dd>{b.upfrontPaid ? "Upfront paid" : "Pending"}</dd>
              </div>
            </div>
            <div className="result-actions">
              {b.status === "confirmed" && (
                <button className="secondary" onClick={() => updateStatus(b.id, "completed")}>
                  Mark Completed
                </button>
              )}
              {b.status === "pending_payment" && (
                <button className="danger" onClick={() => updateStatus(b.id, "cancelled")}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
