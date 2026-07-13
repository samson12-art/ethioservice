import { CalendarCheck, CreditCard, Clock } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "Date not set";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function getShortId(id) {
  if (!id) return "N/A";
  return id.toString().slice(-6);
}

function getStatusInfo(status) {
  switch (status) {
    case "fully_paid": return { text: "Fully Paid", class: "ok" };
    case "completed": return { text: "Completed - Payment Due", class: "pending" };
    case "confirmed": return { text: "Confirmed", class: "ok" };
    case "pending_payment": return { text: "Pending Payment", class: "bad" };
    default: return { text: status || "Pending", class: "bad" };
  }
}

function calculateCountdown(bookingDate, time) {
  if (!bookingDate) return { expired: true, text: "Date not set" };
  const dt = new Date(bookingDate);
  if (time) {
    const [h, m] = time.split(":");
    dt.setHours(parseInt(h), parseInt(m));
  }
  const diff = dt - new Date();
  if (diff <= 0) return { expired: true, text: "Time passed" };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return { expired: false, text: `${days}d ${hours}h left` };
  if (hours > 0) return { expired: false, text: `${hours}h ${minutes}m left` };
  return { expired: false, text: `${minutes}m left` };
}

export default function DashboardPage({ user, bookings, completeService, openRemainingPaymentModal }) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="empty-state">
        <CalendarCheck size={44} />
        <h2>No bookings yet</h2>
        <p>Go to Services, Doctors, or Tutors to book a service.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      {bookings.map((b) => {
        const statusInfo = getStatusInfo(b.status);
        const countdown = b.status === "confirmed" ? calculateCountdown(b.bookingDate, b.time) : null;
        const progress = ((b.upfrontAmount || 0) / (b.totalPrice || 1)) * 100;

        return (
          <div key={b.id} className="panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                  <span className="badge">{b.serviceType || "Service"}</span>
                  <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>
                  {countdown && !countdown.expired && <span className="badge pending">⏰ {countdown.text}</span>}
                  {countdown && countdown.expired && <span className="badge bad">⏰ Time passed</span>}
                </div>
                <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>{b.itemName || "Service Booking"}</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginBottom: "16px", color: "var(--muted)", fontSize: "14px" }}>
                  <div>
                    <p style={{ fontSize: "12px", marginBottom: "2px" }}>Date & Time</p>
                    <p style={{ fontWeight: "600", color: "var(--text)" }}>{formatDate(b.bookingDate)} at {b.time || "09:00 AM"}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", marginBottom: "2px" }}>Booking ID</p>
                    <p style={{ fontWeight: "600", color: "var(--text)", fontFamily: "monospace" }}>#{getShortId(b.id)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", marginBottom: "2px" }}>Total</p>
                    <p style={{ fontWeight: "800", fontSize: "18px", color: "var(--accent)" }}>{Math.round(b.totalPrice || 0)} Br</p>
                  </div>
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                    <span style={{ color: "var(--muted)" }}>Payment Progress</span>
                    <span style={{ fontWeight: "700" }}>{Math.round(b.upfrontAmount || 0)} / {Math.round(b.totalPrice || 0)} Br</span>
                  </div>
                  <div className="progress-bar">
                    <div className="fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "24px", fontSize: "13px" }}>
                  <div><span style={{ color: "var(--muted)" }}>Upfront: </span><strong style={{ color: "#136f63" }}>{Math.round(b.upfrontAmount || 0)} Br</strong></div>
                  <div><span style={{ color: "var(--muted)" }}>Remaining: </span><strong style={{ color: "#f59e0b" }}>{Math.round(b.remainingAmount || 0)} Br</strong></div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {b.status === "confirmed" && (
                  <button onClick={() => completeService(b.id)}>
                    <CreditCard size={18} /> Mark Completed
                  </button>
                )}
                {b.status === "completed" && b.remainingAmount > 0 && (
                  <button style={{ background: "#f59e0b" }} onClick={() => openRemainingPaymentModal(b.id, b.remainingAmount)}>
                    <CreditCard size={18} /> Pay {Math.round(b.remainingAmount)} Br
                  </button>
                )}
                {b.status === "fully_paid" && (
                  <span className="badge ok" style={{ padding: "10px 20px" }}>✓ Fully Paid</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
