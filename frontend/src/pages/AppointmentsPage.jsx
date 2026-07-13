import { CalendarCheck } from "lucide-react";

export default function AppointmentsPage({ bookings }) {
  return (
    <>
      <div className="panel">
        <div className="panel-title">
          <CalendarCheck />
          <div>
            <h2>My Appointments</h2>
            <p className="muted">{bookings.length} appointment(s)</p>
          </div>
        </div>
        {bookings.length === 0 ? (
          <p className="muted" style={{ marginTop: "16px" }}>No appointments scheduled.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b.serviceType}</td>
                    <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                    <td>{b.time}</td>
                    <td>
                      <span className={`badge ${b.status === "confirmed" ? "ok" : "pending"}`}>
                        {b.status === "confirmed" ? "Confirmed" : "Pending"}
                      </span>
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
