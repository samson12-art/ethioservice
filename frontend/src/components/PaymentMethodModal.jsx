import { useState } from "react";

export default function PaymentMethodModal({ show, paymentData, onProcess, onClose, onBack }) {
  const [method, setMethod] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);

  if (!show || !paymentData) return null;

  const handleSubmit = async () => {
    if (method === "telebirr" && !phoneNumber) return;
    if (method === "chapa" && !email) return;
    setProcessing(true);
    await onProcess(method, phoneNumber, email);
    setProcessing(false);
    setMethod(null);
    setPhoneNumber("");
    setEmail("");
  };

  const handleBack = () => {
    setMethod(null);
    setPhoneNumber("");
    setEmail("");
  };

  if (!method) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h2 style={{ textAlign: "center" }}>Select Payment Method</h2>
          <p className="muted" style={{ textAlign: "center", marginBottom: "20px" }}>
            Upfront: <strong style={{ color: "var(--accent)" }}>ETB {Math.round(paymentData.upfrontAmount)}</strong>
          </p>
          <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
            <button className="payment-option" onClick={() => setMethod("telebirr")}>
              <span className="option-icon">📱</span>
              <div className="option-text">
                <strong>Telebirr</strong>
                <small>Pay using Telebirr mobile money</small>
              </div>
            </button>
            <button className="payment-option" onClick={() => setMethod("chapa")}>
              <span className="option-icon">💳</span>
              <div className="option-text">
                <strong>Chapa</strong>
                <small>Pay using Chapa (Card/Bank)</small>
              </div>
            </button>
          </div>
          <button className="secondary" style={{ width: "100%" }} onClick={onBack}>← Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ textAlign: "center" }}>{method === "telebirr" ? "Telebirr" : "Chapa"} Payment</h2>
        <p className="muted" style={{ textAlign: "center", marginBottom: "20px" }}>
          Amount: <strong style={{ color: "var(--accent)" }}>ETB {Math.round(paymentData.upfrontAmount)}</strong>
        </p>
        {method === "telebirr" && (
          <label>
            Phone Number
            <input type="tel" placeholder="09XXXXXXXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </label>
        )}
        {method === "chapa" && (
          <label>
            Email Address
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
        )}
        <div className="modal-buttons">
          <button onClick={handleSubmit} disabled={processing}>{processing ? "Processing..." : `Pay ETB ${Math.round(paymentData.upfrontAmount)}`}</button>
          <button className="secondary" onClick={handleBack}>Back</button>
        </div>
      </div>
    </div>
  );
}
