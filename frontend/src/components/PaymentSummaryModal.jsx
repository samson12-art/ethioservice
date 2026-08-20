export default function PaymentSummaryModal({ show, paymentData, onPayNow, onClose }) {
  if (!show || !paymentData) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ textAlign: "center" }}>Booking Summary</h2>
        <div className="payment-highlight">
          <div className="label">Total Amount</div>
          <div className="amount">ETB {Math.round(paymentData.totalAmount || 0)}</div>
        </div>
        <div className="details">
          <div>
            <dt>Upfront Payment (20%)</dt>
            <dd>ETB {Math.round(paymentData.upfrontAmount || 0)}</dd>
          </div>
          <div>
            <dt>Remaining on Completion</dt>
            <dd>ETB {Math.round(paymentData.remainingAmount || 0)}</dd>
          </div>
        </div>
        {paymentData.bookingDate && (
          <div className="details" style={{ marginTop: 0 }}>
            <div>
              <dt>Booking Date</dt>
              <dd>{paymentData.bookingDate}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{paymentData.time || paymentData.bookingTime}</dd>
            </div>
          </div>
        )}
        <div className="warning-box">
          You are required to pay 20% upfront. The remaining 80% is payable after the service is completed.
        </div>
        <div className="modal-buttons">
          <button onClick={onPayNow}>Pay Now</button>
          <button className="secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
