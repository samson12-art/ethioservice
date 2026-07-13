import { CreditCard } from "lucide-react";

export default function PaymentsPage({ payments }) {
  return (
    <>
      <div className="panel">
        <div className="panel-title">
          <CreditCard />
          <div>
            <h2>Payment History</h2>
            <p className="muted">{payments.length} transaction(s)</p>
          </div>
        </div>
        {payments.length === 0 ? (
          <p className="muted" style={{ marginTop: "16px" }}>No payments yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td style={{ fontFamily: "monospace" }}>{p.transactionId}</td>
                    <td>{p.amount} Br</td>
                    <td style={{ textTransform: "capitalize" }}>{p.method}</td>
                    <td>
                      <span className={`badge ${p.status === "completed" ? "ok" : "pending"}`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
