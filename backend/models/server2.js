const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Nearby search endpoint
app.get('/api/nearby', (req, res) => {
  const professionals = [
    { _id: '1', name: 'Emergency Plumber', profession: 'Plumber', price: 500, city: 'Addis Ababa', rating: 4.8, distance: '0.5', type: 'service' },
    { _id: '2', name: 'Certified Electrician', profession: 'Electrician', price: 450, city: 'Addis Ababa', rating: 4.9, distance: '1.2', type: 'service' },
    { _id: '3', name: 'Professional Cleaner', profession: 'Cleaner', price: 400, city: 'Addis Ababa', rating: 4.7, distance: '0.8', type: 'service' },
    { _id: '4', name: 'Math Tutor', profession: 'Tutor', price: 350, city: 'Addis Ababa', rating: 4.9, distance: '1.5', type: 'service' },
    { _id: '5', name: 'Dr. Abeba Tekle', profession: 'Doctor', price: 800, city: 'Addis Ababa', rating: 4.9, distance: '2.0', type: 'doctor' }
  ];
  res.json({ success: true, data: professionals });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ success: true, token: 'fake-token', user: { name: 'User', email: req.body.email } });
});

app.post('/api/auth/register', (req, res) => {
  res.json({ success: true, token: 'fake-token', user: { name: req.body.name, email: req.body.email } });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ success: true, user: { name: 'Test User', email: 'test@test.com' } });
});

app.get('/api/services', (req, res) => {
  res.json({ success: true, data: [] });
});

app.post('/api/bookings', (req, res) => {
  res.json({ success: true, message: 'Booking created' });
});

app.get('/api/bookings/my-bookings', (req, res) => {
  res.json({ success: true, data: [] });
});

app.get('/api/tutors', (req, res) => {
  res.json({ success: true, data: [] });
});

app.get('/', (req, res) => {
  res.json({ message: 'EthioService API Running' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});