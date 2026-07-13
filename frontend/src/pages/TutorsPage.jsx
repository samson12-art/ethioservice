import { Search, Star } from "lucide-react";

const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Amharic"];
const levels = ["High School", "Undergraduate", "Graduate", "Language"];

export default function TutorsPage({
  tutors, selectedSubject, setSelectedSubject, selectedLevel, setSelectedLevel,
  searchTutors, loadingTutors, showTutorList, openBookingModal, openReviewModal,
}) {
  return (
    <>
      <div className="panel" style={{ textAlign: "center", marginBottom: "22px" }}>
        <div className="filter-bar" style={{ justifyContent: "center" }}>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
            <option value="">Select Level</option>
            {levels.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <button onClick={searchTutors} disabled={loadingTutors}>
            <Search size={18} />
            {loadingTutors ? "Searching..." : "Find Tutors"}
          </button>
        </div>
      </div>
      {showTutorList && tutors.length > 0 && (
        <div className="card-grid">
          {tutors.map((tutor) => (
            <div key={tutor._id} className="service-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3>{tutor.name}</h3>
                <div>
                  {tutor.online && <span className="mode-badge online">💻 Online</span>}
                  {tutor.inperson && <span className="mode-badge inperson">🏠 In-Person</span>}
                </div>
              </div>
              <p className="category">{tutor.subject} Tutor</p>
              <p className="meta">📅 {tutor.experience} exp</p>
              <p className="price">{tutor.fee} Br/hour</p>
              <p className="rating">
                <Star size={14} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                {tutor.rating} / 5
              </p>
              <div className="card-actions">
                <button onClick={() => openBookingModal("tutor", tutor)}>Book</button>
                <button className="secondary" onClick={() => openReviewModal(tutor)}>Rate</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showTutorList && tutors.length === 0 && <div className="empty-state">No tutors found.</div>}
    </>
  );
}
