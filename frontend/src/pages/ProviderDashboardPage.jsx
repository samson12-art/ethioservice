import { useState, useEffect } from "react";
import { BarChart3, Users, Briefcase, AlertCircle, CheckCircle, Clock } from "lucide-react";
import API from "../services/api";

export default function ProviderDashboardPage({ user }) {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [earningsRes, bookingsRes] = await Promise.all([
        API.get("/payments/earnings"),
        API.get("/bookings/provider-bookings")
      ]);
      setStats(earningsRes.data.data);
      setBookings(bookingsRes.data.data || []);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>Loading dashboard...</div>;
  }

  const recentBookings = bookings.slice(0, 5);

  return (
    <div style={{ display: "grid", gap: "22px" }}>
      <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        <div className="stat-card">
          <div className="stat-icon"><Briefcase size={28} color="var(--accent)" /></div>
          <div className="stat-title">Total Bookings</div>
          <div className="stat-value">{stats?.totalBookings || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><CheckCircle size={28} color="#10b981" /></div>
          <div className="stat-title">Completed</div>
          <div className="stat-value">{stats?.completedBookings || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ fontSize: "28px", color: "var(--accent)" }}>Br</div>
          <div className="stat-title">Total Earnings</div>
          <div className="stat-value">{stats?.totalEarnings?.toLocaleString() || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Clock size={28} color="#f59e0b" /></div>
          <div className="stat-title">Pending Payments</div>
          <div className="stat-value">{stats?.pendingPayments?.toLocaleString() || 0}</div>
        </div>
      </div>

      <div className="panel">
        <h2>Recent Bookings</h2>
        {recentBookings.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={40} />
            <p>No bookings yet</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.itemName}</td>
                    <td>{b.customerId}</td>
                    <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                    <td>{Math.round(b.totalPrice)} Br</td>
                    <td>
                      <span className={`badge ${b.status === 'completed' || b.status === 'fully_paid' ? 'ok' : b.status === 'cancelled' ? 'bad' : 'pending'}`}>
                        {b.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
