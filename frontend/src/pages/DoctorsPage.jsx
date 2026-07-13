import { Search, Star } from "lucide-react";

const specialties = ["All", "General Physician", "Pediatrician", "Cardiologist"];

export default function DoctorsPage({ doctors, searchTerm, setSearchTerm, selectedSpecialty, setSelectedSpecialty, openBookingModal, openReviewModal }) {
  const filtered = doctors.filter((doc) => {
    const matchSearch =
      searchTerm === "" ||
      doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialtyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSpec = selectedSpecialty === "All" || doc.specialtyName === selectedSpecialty;
    return matchSearch && matchSpec;
  });

  return (
    <>
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search doctors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="specialty-bar">
        {specialties.map((s) => (
          <button
            key={s}
            className={selectedSpecialty === s ? "active" : ""}
            onClick={() => setSelectedSpecialty(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="card-grid">
        {filtered.map((doc) => (
          <div key={doc.id} className="service-card">
            <h3>{doc.name}</h3>
            <p className="category">{doc.specialtyName}</p>
            <p className="meta">🏥 {doc.hospital}</p>
            <p className="price">{doc.fee} Birr</p>
            <p className="rating">
              <Star size={14} style={{ verticalAlign: "middle", marginRight: "4px" }} />
              {doc.rating} / 5
            </p>
            <div className="card-actions">
              <button onClick={() => openBookingModal("doctor", doc)}>Book</button>
              <button className="secondary" onClick={() => openReviewModal(doc)}>Rate</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="empty-state">No doctors found.</div>}
      </div>
    </>
  );
}
