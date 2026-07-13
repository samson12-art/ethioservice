export default function PaymentSummaryModal({ show, paymentData, onPayNow, onClose }) {
  if (!show || !paymentData) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ textAlign: "center" }}>Payment Summary</h2>

        <div className="payment-highlight">
          <div className="label">Upfront Payment</div>
          <div className="amount">ETB {Math.round(paymentData.upfrontAmount)}</div>
        </div>

        <div style={{ textAlign: "center", padding: "12px", border: "1px solid var(--border)", borderRadius: "8px", marginBottom: "16px" }}>
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>Remaining Payment</p>
          <p style={{ fontSize: "24px", fontWeight: "800", color: "#f59e0b" }}>ETB {Math.round(paymentData.remainingAmount)}</p>
          <p style={{ color: "var(--muted)", fontSize: "12px" }}>(94.05%)</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
          <span style={{ color: "var(--muted)" }}>Platform Fee</span>
          <span style={{ fontWeight: "700" }}>ETB {Math.round(paymentData.serviceFee)} <span style={{ color: "var(--muted)", fontSize: "12px" }}>(0.95%)</span></span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "14px" }}>
          <span style={{ color: "var(--muted)" }}>Booking Guarantee</span>
          <span style={{ fontWeight: "700" }}>ETB {Math.round(paymentData.guaranteeFee)} <span style={{ color: "var(--muted)", fontSize: "12px" }}>(5%)</span></span>
        </div>

        <div className="warning-box">
          <strong>⚠ Important</strong><br />
          <span style={{ fontSize: "12px" }}>5% guarantee fee is non-refundable. Booking is secured after upfront payment.</span>
        </div>

        <div className="modal-buttons">
          <button onClick={onPayNow}>Pay Now</button>
          <button className="secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
