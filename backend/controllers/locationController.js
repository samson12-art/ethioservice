const Service = require('../models/Service');
const Doctor = require('../models/Doctor');
const Tutor = require('../models/Tutor');

// Ethiopian cities coordinates
const cityCoordinates = {
  'Addis Ababa': { lat: 9.0320, lng: 38.7469 },
  'Bahir Dar': { lat: 11.5742, lng: 37.3613 },
  'Gondar': { lat: 12.6030, lng: 37.4586 },
  'Hawassa': { lat: 7.0500, lng: 38.4769 },
  'Dire Dawa': { lat: 9.6000, lng: 41.8500 },
  'Mekelle': { lat: 13.4933, lng: 39.4769 },
  'Jimma': { lat: 7.6731, lng: 36.8344 },
  'Dessie': { lat: 11.1333, lng: 39.6333 }
};

// Sample services data
const sampleServices = [
  { id: 1, name: "Emergency Plumber", profession: "Plumber", price: 500, city: "Addis Ababa", rating: 4.8, distance: "0.5", category: "plumber" },
  { id: 2, name: "Certified Electrician", profession: "Electrician", price: 450, city: "Addis Ababa", rating: 4.9, distance: "1.2", category: "electrician" },
  { id: 3, name: "Professional Cleaner", profession: "Cleaner", price: 400, city: "Addis Ababa", rating: 4.7, distance: "0.8", category: "cleaner" },
  { id: 4, name: "Math Tutor", profession: "Tutor", price: 350, city: "Addis Ababa", rating: 4.9, distance: "1.5", category: "tutor" },
  { id: 5, name: "Home Painter", profession: "Painter", price: 600, city: "Addis Ababa", rating: 4.8, distance: "2.0", category: "painter" },
  { id: 6, name: "Car Mechanic", profession: "Mechanic", price: 550, city: "Addis Ababa", rating: 4.7, distance: "1.8", category: "mechanic" },
  { id: 7, name: "Wedding Photographer", profession: "Photographer", price: 2000, city: "Addis Ababa", rating: 4.9, distance: "3.2", category: "photographer" },
  { id: 8, name: "Security Guard", profession: "Security", price: 300, city: "Addis Ababa", rating: 4.6, distance: "2.5", category: "security" },
  { id: 9, name: "Appliance Repair", profession: "Repair", price: 480, city: "Addis Ababa", rating: 4.8, distance: "1.0", category: "repair" },
  { id: 10, name: "Moving Service", profession: "Mover", price: 800, city: "Addis Ababa", rating: 4.7, distance: "2.8", category: "moving" },
  { id: 11, name: "Dr. Abeba Tekle", profession: "General Physician", price: 800, city: "Addis Ababa", rating: 4.9, distance: "1.2", type: "doctor" },
  { id: 12, name: "Dr. Tedros Adhanom", profession: "Cardiologist", price: 1200, city: "Addis Ababa", rating: 4.95, distance: "1.5", type: "doctor" }
];

// Sample doctors
const sampleDoctors = [
  { id: 101, name: "Dr. Abeba Tekle", specialtyName: "General Physician", fee: 800, city: "Addis Ababa", rating: 4.9 },
  { id: 102, name: "Dr. Tedros Adhanom", specialtyName: "Cardiologist", fee: 1200, city: "Addis Ababa", rating: 4.95 },
  { id: 103, name: "Dr. Yeshigeta Gelaw", specialtyName: "Ophthalmologist", fee: 850, city: "Addis Ababa", rating: 4.8 }
];

// Sample tutors
const sampleTutors = [
  { id: 201, name: "Dr. Alemu Tesfaye", subject: "Mathematics", fee: 400, city: "Addis Ababa", rating: 4.9 },
  { id: 202, name: "Teacher Selamawit", subject: "English", fee: 350, city: "Addis Ababa", rating: 4.8 },
  { id: 203, name: "Mr. Yonas Desta", subject: "Physics", fee: 450, city: "Addis Ababa", rating: 4.9 }
];

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const getNearbyServices = async (req, res) => {
  try {
    const { lat, lng, radius = 20 } = req.query;
    
    console.log('📍 Nearby search request:', { lat, lng, radius });
    
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude required' });
    }
    
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const maxRadius = parseFloat(radius);
    
    let results = [];
    
    // Try to get services from database first
    try {
      const dbServices = await Service.find({ isAvailable: true });
      if (dbServices && dbServices.length > 0) {
        for (const item of dbServices) {
          const coords = cityCoordinates[item.city];
          if (coords) {
            const distance = calculateDistance(userLat, userLng, coords.lat, coords.lng);
            if (distance <= maxRadius) {
              results.push({
                _id: item._id,
                name: item.title,
                profession: item.category,
                price: item.price,
                city: item.city,
                rating: item.rating || 4.5,
                distance: distance.toFixed(1),
                type: 'service'
              });
            }
          }
        }
      }
    } catch (dbError) {
      console.log('Database error, using sample data');
    }
    
    // If no results from database, use sample data
    if (results.length === 0) {
      console.log('Using sample data');
      results = sampleServices.map(item => ({
        _id: item.id.toString(),
        name: item.name,
        profession: item.profession,
        price: item.price,
        city: item.city,
        rating: item.rating,
        distance: item.distance,
        type: item.type || 'service'
      }));
    }
    
    // Sort by distance
    results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    
    console.log(`✅ Found ${results.length} nearby professionals`);
    
    res.json({ success: true, data: results, count: results.length });
  } catch (error) {
    console.error('❌ Error in nearby search:', error);
    // Return sample data on error
    const fallbackResults = sampleServices.map(item => ({
      _id: item.id.toString(),
      name: item.name,
      profession: item.profession,
      price: item.price,
      city: item.city,
      rating: item.rating,
      distance: item.distance,
      type: item.type || 'service'
    }));
    res.json({ success: true, data: fallbackResults, count: fallbackResults.length });
  }
};

module.exports = { getNearbyServices };