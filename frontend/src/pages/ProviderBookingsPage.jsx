import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
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
            <div className="details">
              <div>
                <dt>Customer ID</dt>
                <dd>{b.customerId}</dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>{new Date(b.bookingDate).toLocaleDateString()}</dd>
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
