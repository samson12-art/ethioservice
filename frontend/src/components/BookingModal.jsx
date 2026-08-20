export default function BookingModal({
  show, item, type, onClose, bookingDate, setBookingDate,
  bookingTime, setBookingTime, bookingMode, setBookingMode,
  bookingDescription, setBookingDescription,
  onConfirm, loading, getTodayDate,
}) {
  if (!show || !item) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ textAlign: "center" }}>Confirm Your Booking</h2>
        <p className="muted" style={{ textAlign: "center", marginBottom: "16px" }}>{item.name || item.title}</p>

        <div style={{ background: "#e7f6f1", padding: "14px", borderRadius: "8px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontWeight: "600" }}>Service Type:</span>
            <span style={{ fontWeight: "700", color: "var(--accent)" }}>{item.specialtyName || item.subject || item.category}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: "600" }}>Total Price:</span>
            <span style={{ fontWeight: "800", color: "var(--accent)" }}>{item.fee || item.price} Br</span>
          </div>
        </div>

        <label>
          Select Date
          <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} min={getTodayDate()} required />
        </label>

        <label style={{ marginTop: "12px" }}>
          Select Time
          <select value={bookingTime} onChange={(e) => setBookingTime(e.target.value)}>
            <option value="08:00">08:00 AM</option>
            <option value="09:00">09:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="13:00">01:00 PM</option>
            <option value="14:00">02:00 PM</option>
            <option value="15:00">03:00 PM</option>
            <option value="16:00">04:00 PM</option>
          </select>
        </label>

        {item.subject && (
          <label style={{ marginTop: "12px" }}>
            Session Mode
            <div style={{ display: "flex", gap: "16px", marginTop: "4px" }}>
              {item.online !== false && (
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "14px" }}>
                  <input type="radio" name="mode" value="online" checked={bookingMode === "online"} onChange={(e) => setBookingMode(e.target.value)} />
                  Online
                </label>
              )}
              {item.inperson !== false && (
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "14px" }}>
                  <input type="radio" name="mode" value="inperson" checked={bookingMode === "inperson"} onChange={(e) => setBookingMode(e.target.value)} />
                  In-Person
                </label>
              )}
            </div>
          </label>
        )}

        <label style={{ marginTop: "12px" }}>
          Describe What You Need
          <textarea
            value={bookingDescription}
            onChange={(e) => setBookingDescription(e.target.value)}
            rows="3"
            placeholder="Describe what you need help with (e.g., broken kitchen tap, Math tutoring for grade 10...)"
          />
        </label>

        <div className="modal-buttons">
          <button onClick={onConfirm} disabled={loading}>{loading ? "Processing..." : "Confirm & Continue"}</button>
          <button className="secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
