import { Search } from "lucide-react";

export default function HomePage({ heroSearch, setHeroSearch, onSearch, setActivePage }) {
  return (
    <>
      <div className="hero-section">
        <h1>WELCOME TO<br />ETHIOSERVICE</h1>
        <div className="hero-search-box">
          <input
            type="text"
            placeholder="Search services, doctors, tutors..."
            value={heroSearch}
            onChange={(e) => setHeroSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
          <button onClick={onSearch}>
            <Search size={18} /> Search
          </button>
        </div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
        {[
          { icon: "🔧", label: "Services", page: "services" },
          { icon: "👨‍⚕️", label: "Doctors", page: "doctors" },
          { icon: "📚", label: "Tutors", page: "tutors" },
          { icon: "📍", label: "Nearby", page: "nearby" },
        ].map((item) => (
          <div
            key={item.page}
            className="panel"
            style={{ textAlign: "center", cursor: "pointer", padding: "32px 22px" }}
            onClick={() => setActivePage(item.page)}
          >
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>{item.icon}</div>
            <h3>{item.label}</h3>
          </div>
        ))}
      </div>
    </>
  );
}
