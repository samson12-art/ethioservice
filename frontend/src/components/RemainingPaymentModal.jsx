import { useState } from "react";

export default function RemainingPaymentModal({ show, remainingPaymentData, onProcess, onClose }) {
  const [method, setMethod] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);

  if (!show || !remainingPaymentData) return null;

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
          <h2 style={{ textAlign: "center" }}>Pay Remaining Amount</h2>
          <p className="muted" style={{ textAlign: "center", marginBottom: "20px" }}>
            Remaining: <strong style={{ color: "#f59e0b" }}>ETB {Math.round(remainingPaymentData.remainingAmount)}</strong>
          </p>
          <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
            <button className="payment-option" onClick={() => setMethod("telebirr")}>
              <span className="option-icon">📱</span>
              <div className="option-text"><strong>Telebirr</strong><small>Pay using Telebirr</small></div>
            </button>
            <button className="payment-option" onClick={() => setMethod("chapa")}>
              <span className="option-icon">💳</span>
              <div className="option-text"><strong>Chapa</strong><small>Pay using Chapa</small></div>
            </button>
            <button className="payment-option" onClick={() => setMethod("cash")}>
              <span className="option-icon">💵</span>
              <div className="option-text"><strong>Cash</strong><small>Pay with cash to provider</small></div>
            </button>
          </div>
          <button className="secondary" style={{ width: "100%" }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ textAlign: "center" }}>{method === "telebirr" ? "Telebirr" : method === "chapa" ? "Chapa" : "Cash"} Payment</h2>
        <p className="muted" style={{ textAlign: "center", marginBottom: "20px" }}>
          Amount: <strong style={{ color: "#f59e0b" }}>ETB {Math.round(remainingPaymentData.remainingAmount)}</strong>
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
        {method === "cash" && (
          <div style={{ background: "#e7f6f1", padding: "14px", borderRadius: "8px", textAlign: "center", marginBottom: "16px" }}>
            <p>You will pay <strong>ETB {Math.round(remainingPaymentData.remainingAmount)}</strong> in cash to the provider.</p>
          </div>
        )}
        <div className="modal-buttons">
          <button style={{ background: "#f59e0b" }} onClick={handleSubmit} disabled={processing}>
            {processing ? "Processing..." : `Pay ETB ${Math.round(remainingPaymentData.remainingAmount)}`}
          </button>
          <button className="secondary" onClick={handleBack}>Back</button>
        </div>
      </div>
    </div>
  );
}
