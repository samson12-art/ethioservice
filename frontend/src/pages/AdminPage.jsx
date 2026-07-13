import { Shield, Users, Clock, CreditCard, BarChart3 } from "lucide-react";

export default function AdminPage({ adminStats, pendingProviders, verifyProvider }) {
  const stats = [
    { icon: <Users size={24} />, title: "Total Users", value: adminStats?.totalUsers || 0, color: "#136f63" },
    { icon: <Users size={24} />, title: "Providers", value: adminStats?.totalProviders || 0, color: "#3b82f6" },
    { icon: <Clock size={24} />, title: "Pending", value: adminStats?.pendingProviders || 0, color: "#f59e0b" },
    { icon: <CreditCard size={24} />, title: "Bookings", value: adminStats?.totalBookings || 0, color: "#136f63" },
    { icon: <BarChart3 size={24} />, title: "Revenue", value: `${adminStats?.totalRevenue || 0} Br`, color: "#136f63" },
  ];

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ color: s.color }}>{s.icon}</div>
            <p className="stat-title">{s.title}</p>
            <p className="stat-value">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-title">
          <Clock />
          <div>
            <h2>Pending Provider Verifications</h2>
            <p className="muted">{pendingProviders?.length || 0} pending requests</p>
          </div>
        </div>
        {!pendingProviders || pendingProviders.length === 0 ? (
          <p className="muted" style={{ marginTop: "16px" }}>No pending verifications.</p>
        ) : (
          <div style={{ marginTop: "16px", display: "grid", gap: "14px" }}>
            {pendingProviders.map((p) => (
              <div key={p._id} className="provider-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h3 style={{ marginBottom: "4px" }}>{p.name}</h3>
                    <p className="muted" style={{ fontSize: "14px" }}>📧 {p.email}</p>
                    <p className="muted" style={{ fontSize: "14px" }}>📞 {p.phone}</p>
                    <p className="muted" style={{ fontSize: "14px" }}>💼 {p.profession}</p>
                    {p.experience && <p className="muted" style={{ fontSize: "14px" }}>📅 {p.experience} years exp</p>}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => verifyProvider(p._id, "approved")}>
                      <Shield size={18} /> Approve
                    </button>
                    <button className="danger" onClick={() => verifyProvider(p._id, "rejected")}>
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
