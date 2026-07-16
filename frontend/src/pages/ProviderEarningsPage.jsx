import { useState, useEffect } from "react";
import { DollarSign, Clock, CheckCircle } from "lucide-react";
import API from "../services/api";

export default function ProviderEarningsPage({ user }) {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      const { data } = await API.get("/payments/earnings");
      setEarnings(data.data);
    } catch (err) {
      console.error("Failed to load earnings:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>Loading earnings...</div>;
  }

  if (!earnings) {
    return <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>No earnings data available</div>;
  }

  return (
    <div style={{ display: "grid", gap: "22px" }}>
      <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: "var(--accent)" }}><DollarSign size={28} /></div>
          <div className="stat-title">Total Earnings</div>
          <div className="stat-value">{earnings.totalEarnings?.toLocaleString()} Br</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: "#10b981" }}><CheckCircle size={28} /></div>
          <div className="stat-title">Upfront Received</div>
          <div className="stat-value">{earnings.totalUpfront?.toLocaleString()} Br</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: "#3b82f6" }}><DollarSign size={28} /></div>
          <div className="stat-title">Remaining Collected</div>
          <div className="stat-value">{earnings.totalRemaining?.toLocaleString()} Br</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: "#f59e0b" }}><Clock size={28} /></div>
          <div className="stat-title">Pending Payments</div>
          <div className="stat-value">{earnings.pendingPayments?.toLocaleString()} Br</div>
        </div>
      </div>

      <div className="panel">
        <h2>Earnings Breakdown</h2>
        <div className="details">
          <div>
            <dt>Total Bookings</dt>
            <dd>{earnings.totalBookings}</dd>
          </div>
          <div>
            <dt>Completed Bookings</dt>
            <dd>{earnings.completedBookings}</dd>
          </div>
          <div>
            <dt>Completion Rate</dt>
            <dd>{earnings.totalBookings > 0 ? Math.round((earnings.completedBookings / earnings.totalBookings) * 100) : 0}%</dd>
          </div>
          <div>
            <dt>Avg. per Booking</dt>
            <dd>{earnings.completedBookings > 0 ? Math.round(earnings.totalEarnings / earnings.completedBookings) : 0} Br</dd>
          </div>
        </div>
      </div>
    </div>
  );
}
