import { Search, Star } from "lucide-react";

export default function ServicesPage({ services, serviceSearchTerm, setServiceSearchTerm, openBookingModal, openReviewModal }) {
  const filtered = services.filter(
    (s) =>
      serviceSearchTerm === "" ||
      s.title?.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
      s.category?.toLowerCase().includes(serviceSearchTerm.toLowerCase())
  );

  return (
    <>
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search services..."
          value={serviceSearchTerm}
          onChange={(e) => setServiceSearchTerm(e.target.value)}
        />
      </div>
      <div className="card-grid">
        {filtered.map((service) => (
          <div key={service.id} className="service-card">
            <h3>{service.title}</h3>
            <p className="category">{service.category}</p>
            <p className="price">{service.price} Br</p>
            <p className="rating">
              <Star size={14} style={{ verticalAlign: "middle", marginRight: "4px" }} />
              {service.rating} / 5
            </p>
            <div className="card-actions">
              <button onClick={() => openBookingModal("service", service)}>Book</button>
              <button className="secondary" onClick={() => openReviewModal(service)}>Rate</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="empty-state">No services found.</div>}
      </div>
    </>
  );
}
