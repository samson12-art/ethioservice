import { MapPin } from "lucide-react";

export default function NearbyPage({
  userLocation, nearbyResults, nearbyRadius, setNearbyRadius,
  nearbyType, setNearbyType, nearbyLoading, locationError,
  getUserLocationAndSearch, searchNearby, openBookingModal, openReviewModal,
}) {
  return (
    <>
      <div className="panel" style={{ textAlign: "center", marginBottom: "22px" }}>
        <div className="panel-title" style={{ justifyContent: "center" }}>
          <MapPin />
          <div>
            <h2>Services Near You</h2>
          </div>
        </div>
        <div className="nearby-controls" style={{ marginTop: "16px" }}>
          <button onClick={() => { if (userLocation) searchNearby(userLocation.lat, userLocation.lng, nearbyRadius, nearbyType); else getUserLocationAndSearch(); }}>
            <MapPin size={18} /> Get My Location
          </button>
          <select
            value={nearbyRadius}
            onChange={(e) => {
              const nr = parseInt(e.target.value);
              setNearbyRadius(nr);
              if (userLocation) searchNearby(userLocation.lat, userLocation.lng, nr, nearbyType);
            }}
          >
            <option value="5">5 km</option>
            <option value="10">10 km</option>
            <option value="20">20 km</option>
            <option value="50">50 km</option>
          </select>
          <select
            value={nearbyType}
            onChange={(e) => {
              const nt = e.target.value;
              setNearbyType(nt);
              if (userLocation) searchNearby(userLocation.lat, userLocation.lng, nearbyRadius, nt);
            }}
          >
            <option value="all">All</option>
            <option value="doctors">Doctors</option>
            <option value="services">Services</option>
            <option value="tutors">Tutors</option>
          </select>
        </div>
        {locationError && <p className="muted" style={{ marginTop: "12px" }}>{locationError}</p>}
        {userLocation && <p className="muted" style={{ marginTop: "12px" }}>Found {nearbyResults.length} services nearby.</p>}
        {!userLocation && <p className="muted" style={{ marginTop: "12px" }}>Click "Get My Location" to find services near you.</p>}
        {nearbyLoading && <p className="muted" style={{ marginTop: "12px" }}>Loading...</p>}
      </div>
      {userLocation && nearbyResults.length > 0 && (
        <div className="card-grid">
          {nearbyResults.map((item) => (
            <div key={item._id} className="service-card">
              <h3>{item.name}</h3>
              <p className="category">{item.category}</p>
              {item.hospital && <p className="meta">🏥 {item.hospital}</p>}
              <p className="price">{item.price} Br</p>
              <p className="rating">⭐ {item.rating} / 5</p>
              <span className="distance-badge">🚗 {item.distance} km away</span>
              <div className="card-actions">
                <button onClick={() => openBookingModal(item.type, item)}>Book</button>
                <button className="secondary" onClick={() => openReviewModal(item)}>Rate</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
