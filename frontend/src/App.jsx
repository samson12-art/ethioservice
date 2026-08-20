import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./context/AuthContext";
import API from "./services/api";
import Sidebar from "./components/Sidebar";
import "./App.css";

import DismissibleAlert from "./components/DismissibleAlert";
import BookingModal from "./components/BookingModal";
import ReviewModal from "./components/ReviewModal";
import PaymentSummaryModal from "./components/PaymentSummaryModal";
import PaymentMethodModal from "./components/PaymentMethodModal";
import RemainingPaymentModal from "./components/RemainingPaymentModal";

import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import DoctorsPage from "./pages/DoctorsPage";
import TutorsPage from "./pages/TutorsPage";
import NearbyPage from "./pages/NearbyPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
import ReviewsPage from "./pages/ReviewsPage";
import PaymentsPage from "./pages/PaymentsPage";
import MessagesPage from "./pages/MessagesPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import HelpPage from "./pages/HelpPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import AdminComplaintsPage from "./pages/AdminComplaintsPage";
import ProviderComplaintsPage from "./pages/ProviderComplaintsPage";
import ProviderDashboardPage from "./pages/ProviderDashboardPage";
import ProviderBookingsPage from "./pages/ProviderBookingsPage";
import ProviderEarningsPage from "./pages/ProviderEarningsPage";



const pageTitles = {
  home: "Home",
  services: "Services",
  doctors: "Doctors",
  tutors: "Tutors",
  nearby: "Nearby",
  dashboard: "My Bookings",
  "provider-dashboard": "My Dashboard",
  "provider-bookings": "My Bookings",
  "provider-earnings": "Earnings",
  admin: "Admin Panel",
  reviews: "Reviews",
  payments: "Payments",
  messages: "Messages",
  appointments: "Appointments",
  help: "Help Center",
  complaints: "Complaints",
  "admin-complaints": "User Complaints",
  "provider-complaints": "Assigned Complaints",
};

export default function App() {
  const { user, token, initialLoading, login, register, registerProvider, logout } = useAuth();
  const [activePage, setActivePage] = useState("home");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Addis Ababa");
  const [showLogin, setShowLogin] = useState(true);
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [profession, setProfession] = useState("");
  const [experience, setExperience] = useState("");
  const [providerPrice, setProviderPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("hour");
  const [description, setDescription] = useState("");
  const [providerAgreement, setProviderAgreement] = useState(false);
  const [certificateFile, setCertificateFile] = useState(null);
  const [experienceLetter, setExperienceLetter] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [payments, setPayments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [adminStats, setAdminStats] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [serviceSearchTerm, setServiceSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [heroSearch, setHeroSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [showTutorList, setShowTutorList] = useState(false);
  const [loadingTutors, setLoadingTutors] = useState(false);

  const [userLocation, setUserLocation] = useState(null);
  const [nearbyResults, setNearbyResults] = useState([]);
  const [nearbyRadius, setNearbyRadius] = useState(10);
  const [nearbyType, setNearbyType] = useState("all");
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("09:00");
  const [bookingMode, setBookingMode] = useState("online");
  const [bookingDescription, setBookingDescription] = useState("");

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReviewItem, setSelectedReviewItem] = useState(null);

  const [showPaymentSummaryModal, setShowPaymentSummaryModal] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [showRemainingPaymentModal, setShowRemainingPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [remainingPaymentData, setRemainingPaymentData] = useState(null);
  const [tempBookingId, setTempBookingId] = useState(null);

  const [chatMessage, setChatMessage] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [providerComplaints, setProviderComplaints] = useState([]);

  const isAdmin = user?.role === "admin";
  const primaryColor = "#136f63";

  useEffect(() => {
    if (token) {
      loadBookings();
      loadReviews();
      loadPayments();
      loadMessages();
      loadComplaints();
      if (user?.role === "admin") {
        loadPendingProviders();
        loadAdminStats();
        loadAllComplaints();
      }
      if (user?.role === "provider") {
        loadProviderComplaints();
      }
    }
    loadDoctors();
    loadServices();
    loadTutors();
  }, [token, user]);

  const loadUser = async () => {
    try {
      await loadBookings();
      await loadReviews();
      await loadPayments();
      await loadMessages();
      await loadComplaints();
      if (user?.role === "admin") {
        await loadPendingProviders();
        await loadAdminStats();
        await loadAllComplaints();
      }
    } catch (err) {
      console.error("Failed to load user data:", err);
    }
  };

  const loadDoctors = async () => {
    try {
      const { data } = await API.get("/services/doctors");
      setDoctors(data.data || []);
    } catch {
      setDoctors([
        { id: "1", name: "Dr. Abeba Tekle", specialtyName: "General Physician", hospital: "Black Lion Hospital", fee: 800, rating: 4.9 },
        { id: "2", name: "Dr. Tedros Adhanom", specialtyName: "Cardiologist", hospital: "St. Paul Hospital", fee: 1200, rating: 4.95 },
      ]);
    }
  };

  const loadServices = async () => {
    try {
      const { data } = await API.get("/services");
      setServices(data.data || []);
    } catch {
      setServices([
        { id: "s1", title: "Plumbing Service", category: "plumber", price: 500, rating: 4.8 },
        { id: "s2", title: "Electrical Service", category: "electrician", price: 455, rating: 4.9 },
        { id: "s3", title: "Cleaning Service", category: "cleaner", price: 400, rating: 4.7 },
      ]);
    }
  };

  const loadTutors = async () => {
    try {
      const { data } = await API.get("/tutors");
      setTutors(data.data || []);
    } catch {
      setTutors([
        { id: "t1", name: "Dr. Alemu Tesfaye", subject: "Mathematics", level: "High School", fee: 400, rating: 4.9, experience: "12 years", city: "Addis Ababa", online: true, inperson: true },
      ]);
    }
  };

  const loadBookings = async () => {
    try {
      const { data } = await API.get("/bookings/my-bookings");
      setBookings(data.data || []);
    } catch {
      setBookings([]);
    }
  };

  const loadReviews = async () => {
    try {
      const { data } = await API.get("/reviews/my-reviews");
      setReviews(data.data || []);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
  };

  const loadPayments = async () => {
    try {
      const { data } = await API.get("/payments/history");
      setPayments(data.data || []);
    } catch (err) {
      console.error("Failed to load payments:", err);
    }
  };

  const loadMessages = async () => {
    try {
      const { data } = await API.get("/messages/conversations");
      setMessages(data.data || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const loadPendingProviders = async () => {
    try {
      const { data } = await API.get("/admin/pending-providers");
      setPendingProviders(data.data || []);
    } catch (err) {
      console.error("Failed to load pending providers:", err);
    }
  };

  const loadAdminStats = async () => {
    try {
      const { data } = await API.get("/admin/stats");
      setAdminStats(data.data);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    }
  };

  const loadComplaints = async () => {
    try {
      const { data } = await API.get("/complaints/my");
      setComplaints(data.data || []);
    } catch (err) {
      console.error("Failed to load complaints:", err);
    }
  };

  const loadAllComplaints = async () => {
    try {
      const { data } = await API.get("/complaints/all");
      setComplaints(data.data || []);
    } catch (err) {
      console.error("Failed to load all complaints:", err);
    }
  };

  const loadProviderComplaints = async () => {
    try {
      const { data } = await API.get("/complaints/provider");
      setProviderComplaints(data.data || []);
    } catch (err) {
      console.error("Failed to load provider complaints:", err);
    }
  };

  const submitComplaint = async (category, subject, description, onSuccess) => {
    if (!category || !subject || !description) {
      setMessage("All fields are required");
      setMessageType("error");
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post("/complaints", { category, subject, description });
      if (data.success) {
        setMessage("Complaint submitted successfully!");
        setMessageType("success");
        loadComplaints();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to submit complaint");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const replyToComplaint = async (complaintId, status, adminReply, onSuccess) => {
    setLoading(true);
    try {
      const { data } = await API.put(`/complaints/${complaintId}/reply`, { status, adminReply });
      if (data.success) {
        setMessage("Reply sent!");
        setMessageType("success");
        loadAllComplaints();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send reply");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const assignComplaint = async (complaintId, providerId, onSuccess) => {
    setLoading(true);
    try {
      const { data } = await API.put(`/complaints/${complaintId}/assign`, { providerId });
      if (data.success) {
        setMessage(data.message || "Complaint assigned!");
        setMessageType("success");
        loadAllComplaints();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to assign complaint");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const updateProviderNotes = async (complaintId, providerNotes, status, onSuccess) => {
    setLoading(true);
    try {
      const { data } = await API.put(`/complaints/${complaintId}/follow-up`, { providerNotes, status });
      if (data.success) {
        setMessage("Follow-up updated!");
        setMessageType("success");
        loadProviderComplaints();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update follow-up");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await login(email, password);
      setMessage("Login successful!");
      setMessageType("success");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await register({ name, email, password, phone, city });
      setMessage("Registration successful!");
      setMessageType("success");
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleProviderRegister = async (e) => {
    e.preventDefault();
    if (!providerAgreement) {
      setMessage("You must agree to the Provider Agreement before registering");
      setMessageType("error");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("city", city);
      formData.append("profession", profession);
      formData.append("experience", experience);
      formData.append("price", providerPrice);
      formData.append("priceUnit", priceUnit);
      formData.append("description", description);
      formData.append("agreedToTerms", "true");
      if (certificateFile) formData.append("certificate", certificateFile);
      if (experienceLetter) formData.append("experienceLetter", experienceLetter);

      await registerProvider(formData);
      setMessage("Provider registration submitted for review!");
      setMessageType("success");
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setActivePage("home");
  };

  const handleHeroSearch = () => {
    if (heroSearch) {
      setServiceSearchTerm(heroSearch);
      setActivePage("services");
    }
  };

  const searchTutors = async () => {
    if (!selectedSubject) { setMessage("Please select a subject"); return; }
    setLoadingTutors(true);
    try {
      let url = `/tutors?subject=${encodeURIComponent(selectedSubject)}`;
      if (selectedLevel) url += `&level=${encodeURIComponent(selectedLevel)}`;
      const { data } = await API.get(url);
      setTutors(data.data || []);
      setShowTutorList(true);
    } catch {
      setMessage("Failed to load tutors");
    } finally {
      setLoadingTutors(false);
    }
  };

  const sendMessage = async () => {
    if (!chatMessage.trim()) return;
    try {
      const response = await API.post("/messages/send", {
        receiverId: messages.length > 0 ? messages[0]?.user?.id : null,
        message: chatMessage
      });
      if (response.data.success) {
        setChatMessage("");
        loadMessages();
        setMessage("Message sent!");
        setMessageType("success");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send message. Please select a conversation first.");
      setMessageType("error");
    }
  };

  const getUserLocationAndSearch = () => {
    setNearbyLoading(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      setNearbyLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        try {
          const { data } = await API.get(`/nearby?lat=${latitude}&lng=${longitude}&radius=${nearbyRadius}&type=${nearbyType}`);
          if (data.success) setNearbyResults(data.data);
        } catch {
          setMessage("Error finding nearby services");
        } finally {
          setNearbyLoading(false);
        }
      },
      () => { setLocationError("Please enable location access"); setNearbyLoading(false); }
    );
  };

  const searchNearby = async (lat, lng, radius, type) => {
    setNearbyLoading(true);
    try {
      const { data } = await API.get(`/nearby?lat=${lat}&lng=${lng}&radius=${radius}&type=${type}`);
      if (data.success) setNearbyResults(data.data);
    } catch {
      setMessage("Error finding nearby services");
    } finally {
      setNearbyLoading(false);
    }
  };

  const openBookingModal = (type, item) => {
    if (!user) { setMessage("Please login first"); return; }
    setSelectedType(type);
    setSelectedItem(item);
    setBookingDate("");
    setBookingTime("09:00");
    setBookingMode(item.online ? "online" : "inperson");
    setBookingDescription("");
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    if (!bookingDate) { setMessage("Please select a date"); return; }
    setLoading(true);
    try {
      const { data } = await API.post("/bookings", {
        serviceType: selectedType, itemId: selectedItem.id,
        bookingDate, time: bookingTime, bookingMode,
        description: bookingDescription,
      });
      if (data.success) {
        setPaymentData(data.data);
        setTempBookingId(data.data.bookingId);
        setShowPaymentSummaryModal(true);
        setShowBookingModal(false);
      }
    } catch {
      setMessage("Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = () => {
    setShowPaymentSummaryModal(false);
    setShowPaymentMethodModal(true);
  };

  const processUpfrontPayment = async (method, phoneNumber, emailAddress) => {
    try {
      const { data } = await API.post("/payments/initiate", {
        bookingId: tempBookingId, method, phoneNumber, email: emailAddress,
      });
      if (data.success) {
        setMessage(`Payment successful! Transaction: ${data.data.transactionId}`);
        setMessageType("success");
        await loadBookings();
        setShowPaymentMethodModal(false);
        setPaymentData(null);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Payment failed. Please try again.");
      setMessageType("error");
    }
  };

  const completeService = async (bookingId) => {
    if (!window.confirm("Has the service been completed?")) return;
    setLoading(true);
    try {
      const { data } = await API.post(`/bookings/complete/${bookingId}`);
      if (data.success) {
        setMessage(data.message);
        setMessageType("success");
        await loadBookings();
      }
    } catch {
      setMessage("Failed to complete service");
    } finally {
      setLoading(false);
    }
  };

  const openRemainingPaymentModal = (bookingId, remainingAmount) => {
    setRemainingPaymentData({ bookingId, remainingAmount });
    setShowRemainingPaymentModal(true);
  };

  const processRemainingPayment = async (method, phoneNumber, emailAddress) => {
    try {
      const { data } = await API.post("/payments/remaining", {
        bookingId: remainingPaymentData.bookingId, method, phoneNumber, email: emailAddress,
      });
      if (data.success) {
        setMessage(data.message);
        setMessageType("success");
        await loadBookings();
        setShowRemainingPaymentModal(false);
        setRemainingPaymentData(null);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Payment failed");
      setMessageType("error");
    }
  };

  const openReviewModal = (item) => {
    if (!user) { setMessage("Please login first"); return; }
    setSelectedReviewItem(item);
    setShowReviewModal(true);
  };

  const submitReview = async (rating, comment) => {
    if (!comment.trim()) { setMessage("Please write a review"); return; }
    setLoading(true);
    try {
      const professionalType = selectedReviewItem.specialtyName ? "doctor" : selectedReviewItem.subject ? "tutor" : "service";
      const { data } = await API.post("/reviews", {
        professionalId: selectedReviewItem.id, professionalType, rating, comment,
      });
      if (data.success) {
        setMessage("Review submitted!");
        setMessageType("success");
        setShowReviewModal(false);
        await loadReviews();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to submit review");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const verifyProvider = async (providerId, status) => {
    try {
      await API.put(`/admin/verify-provider/${providerId}`, { status });
      setMessage(`Provider ${status}!`);
      setMessageType("success");
      loadPendingProviders();
      loadAdminStats();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update provider");
      setMessageType("error");
    }
  };

  const getTodayDate = () => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  };

  if (!token) {
    const professionsList = ["Plumber", "Electrician", "Cleaner", "Tutor", "Painter", "Mechanic", "Driver", "Cook"];
    return (
      <main className="auth-page">
        <section className="auth-panel">
          <div className="brand-mark" style={{ width: "58px", height: "58px", borderRadius: "8px", background: "#e8f2ef", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "28px" }}>🇪🇹</span>
          </div>
          <h1>EthioService</h1>
          {!showProviderForm ? (
            showLogin ? (
              <>
                <p className="muted">Sign in to your account.</p>
                <form onSubmit={handleLogin} className="form-stack">
                  <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </label>
                  <label>
                    <span className="field-heading">
                      Password
                    </span>
                    <span className="password-field">
                      <input type={showLoginPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
                      <button type="button" className="icon-button" onClick={() => setShowLoginPassword(!showLoginPassword)}>
                        {showLoginPassword ? "🙈" : "👁"}
                      </button>
                    </span>
                  </label>
                  {message && <DismissibleAlert message={message} onClose={() => setMessage("")} type={messageType} />}
                  <button type="submit" disabled={loading}>{loading ? "Please wait" : "Login"}</button>
                </form>
                <button className="text-button" onClick={() => { setShowLogin(false); setMessage(""); }}>Sign Up</button>
                <button className="text-button" onClick={() => { setShowProviderForm(true); setMessage(""); }}>Become a Provider →</button>
              </>
            ) : (
              <>
                <p className="muted">Create a new account.</p>
                <form onSubmit={handleRegister} className="form-stack">
                  <label>Full Name<input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></label>
                  <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
                  <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
                  <label>Phone<input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
                  <label>City<select value={city} onChange={(e) => setCity(e.target.value)}>
                    <option>Addis Ababa</option><option>Bahir Dar</option><option>Gondar</option>
                    <option>Hawassa</option><option>Dire Dawa</option><option>Mekelle</option>
                  </select></label>
                  {message && <DismissibleAlert message={message} onClose={() => setMessage("")} type={messageType} />}
                  <button type="submit" disabled={loading}>{loading ? "Creating..." : "Sign Up"}</button>
                </form>
                <button className="text-button" onClick={() => { setShowLogin(true); setMessage(""); }}>Login</button>
                <button className="text-button" onClick={() => { setShowProviderForm(true); setMessage(""); }}>Become a Provider →</button>
              </>
            )
          ) : (
            <>
              <p className="muted">Register as a service provider.</p>
              <form onSubmit={handleProviderRegister} className="form-stack">
                <label>Full Name<input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></label>
                <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
                <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
                <label>Phone<input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required /></label>
                <label>City<select value={city} onChange={(e) => setCity(e.target.value)}>
                  <option>Addis Ababa</option><option>Bahir Dar</option><option>Gondar</option>
                </select></label>
                <label>Profession<select value={profession} onChange={(e) => setProfession(e.target.value)} required>
                  <option value="">Select Profession</option>
                  {professionsList.map((p) => <option key={p}>{p}</option>)}
                </select></label>
                <label>Experience<input type="text" placeholder="Years" value={experience} onChange={(e) => setExperience(e.target.value)} required /></label>
                <label>Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="2" /></label>
                <label>Price (Birr)<input type="number" value={providerPrice} onChange={(e) => setProviderPrice(e.target.value)} required /></label>
                <label>Price Unit<select value={priceUnit} onChange={(e) => setPriceUnit(e.target.value)}>
                  <option value="hour">Per Hour</option><option value="day">Per Day</option><option value="fixed">Fixed</option>
                </select></label>

                <div className="upload-section">
                  <label>Professional Certificate (Required)
                    <div className="file-upload-area">
                      <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setCertificateFile(e.target.files[0])} required />
                      {certificateFile && <span className="file-name">{certificateFile.name}</span>}
                      {!certificateFile && <span className="file-placeholder">Upload your legal professional certificate (JPG, PNG, or PDF)</span>}
                    </div>
                  </label>
                </div>

                <div className="upload-section">
                  <label>Experience Letter (Required)
                    <div className="file-upload-area">
                      <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setExperienceLetter(e.target.files[0])} required />
                      {experienceLetter && <span className="file-name">{experienceLetter.name}</span>}
                      {!experienceLetter && <span className="file-placeholder">Upload your experience/employment letter (JPG, PNG, or PDF)</span>}
                    </div>
                  </label>
                </div>

                <div className="agreement-box">
                  <div className="agreement-header">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    <span className="agreement-title">Provider Agreement</span>
                  </div>
                  <div className="agreement-text">
                    <p>By registering as a service provider on <strong>EthioService</strong>, I hereby agree to the following terms and conditions:</p>
                    <ol>
                      <li><span className="rule-highlight">Commission Fee:</span> I agree to pay a <strong>5% commission</strong> of all my earnings generated through the EthioService platform.</li>
                      <li><span className="rule-highlight">Availability:</span> I commit to being <strong>available and responsive</strong> whenever a client contacts me through the platform.</li>
                      <li><span className="rule-highlight">Honest Service:</span> I will perform all jobs <strong>honestly, professionally, and in real time</strong> as described in each service agreement.</li>
                      <li><span className="rule-highlight">Legal Certification:</span> I confirm that I hold a <strong>valid and legal certificate</strong> for my profession and have uploaded authentic documentation.</li>
                      <li><span className="rule-highlight">No Forced Labor:</span> I confirm that my work on this platform is <strong>completely voluntary</strong>. I am not a victim of, nor involved in, any form of forced or compulsory labor.</li>
                      <li><span className="rule-highlight">Experience Verification:</span> I confirm that the <strong>experience letter</strong> I have uploaded is genuine and accurately represents my professional background.</li>
                    </ol>
                  </div>
                  <label className="agreement-checkbox">
                    <input type="checkbox" checked={providerAgreement} onChange={(e) => setProviderAgreement(e.target.checked)} required />
                    <span>I have read, understood, and agree to all the terms stated in the Provider Agreement above</span>
                  </label>
                </div>

                {message && <DismissibleAlert message={message} onClose={() => setMessage("")} type={messageType} />}
                <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Register as Provider"}</button>
              </form>
              <button className="text-button" onClick={() => { setShowProviderForm(false); setMessage(""); }}>Back to Login</button>
            </>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <Sidebar user={user} activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} />

      <section className="workspace">
        <header className="topbar">
          <h1>{pageTitles[activePage] || "EthioService"}</h1>
          <div className="user-pill">
            <span>{user?.name}</span>
            <strong>{user?.role}</strong>
          </div>
        </header>

        {message && <DismissibleAlert message={message} onClose={() => setMessage("")} wide type={messageType} />}

        {activePage === "home" && (
          <HomePage
            heroSearch={heroSearch} setHeroSearch={setHeroSearch}
            onSearch={handleHeroSearch} setActivePage={setActivePage}
          />
        )}
        {activePage === "services" && (
          <ServicesPage
            services={services} serviceSearchTerm={serviceSearchTerm}
            setServiceSearchTerm={setServiceSearchTerm}
            openBookingModal={openBookingModal} openReviewModal={openReviewModal}
          />
        )}
        {activePage === "doctors" && (
          <DoctorsPage
            doctors={doctors} searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            selectedSpecialty={selectedSpecialty} setSelectedSpecialty={setSelectedSpecialty}
            openBookingModal={openBookingModal} openReviewModal={openReviewModal}
          />
        )}
        {activePage === "tutors" && (
          <TutorsPage
            tutors={tutors} selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject}
            selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel}
            searchTutors={searchTutors} loadingTutors={loadingTutors}
            showTutorList={showTutorList} openBookingModal={openBookingModal}
            openReviewModal={openReviewModal}
          />
        )}
        {activePage === "nearby" && (
          <NearbyPage
            userLocation={userLocation} nearbyResults={nearbyResults}
            nearbyRadius={nearbyRadius} setNearbyRadius={setNearbyRadius}
            nearbyType={nearbyType} setNearbyType={setNearbyType}
            nearbyLoading={nearbyLoading} locationError={locationError}
            getUserLocationAndSearch={getUserLocationAndSearch}
            searchNearby={searchNearby} openBookingModal={openBookingModal}
            openReviewModal={openReviewModal}
          />
        )}
        {activePage === "dashboard" && (
          <DashboardPage
            user={user} bookings={bookings}
            completeService={completeService}
            openRemainingPaymentModal={openRemainingPaymentModal}
          />
        )}
        {activePage === "admin" && isAdmin && (
          <AdminPage
            adminStats={adminStats} pendingProviders={pendingProviders}
            verifyProvider={verifyProvider}
          />
        )}
        {activePage === "provider-dashboard" && user?.role === "provider" && (
          <ProviderDashboardPage user={user} />
        )}
        {activePage === "provider-bookings" && user?.role === "provider" && (
          <ProviderBookingsPage user={user} />
        )}
        {activePage === "provider-earnings" && user?.role === "provider" && (
          <ProviderEarningsPage user={user} />
        )}
        {activePage === "reviews" && <ReviewsPage reviews={reviews} />}
        {activePage === "payments" && <PaymentsPage payments={payments} />}
        {activePage === "messages" && (
          <MessagesPage
            messages={messages} chatMessage={chatMessage}
            setChatMessage={setChatMessage} sendMessage={sendMessage}
          />
        )}
        {activePage === "appointments" && <AppointmentsPage bookings={bookings} />}
        {activePage === "complaints" && (
          <ComplaintsPage complaints={complaints} submitComplaint={submitComplaint} loading={loading} />
        )}
        {activePage === "admin-complaints" && isAdmin && (
          <AdminComplaintsPage complaints={complaints} replyToComplaint={replyToComplaint} assignComplaint={assignComplaint} loading={loading} />
        )}
        {activePage === "provider-complaints" && user?.role === "provider" && (
          <ProviderComplaintsPage complaints={providerComplaints} updateProviderNotes={updateProviderNotes} loading={loading} />
        )}
        {activePage === "help" && <HelpPage />}
      </section>

      <BookingModal
        show={showBookingModal} item={selectedItem} type={selectedType}
        onClose={() => setShowBookingModal(false)}
        bookingDate={bookingDate} setBookingDate={setBookingDate}
        bookingTime={bookingTime} setBookingTime={setBookingTime}
        bookingMode={bookingMode} setBookingMode={setBookingMode}
        bookingDescription={bookingDescription} setBookingDescription={setBookingDescription}
        onConfirm={confirmBooking} loading={loading} getTodayDate={getTodayDate}
      />
      <ReviewModal
        show={showReviewModal} item={selectedReviewItem}
        onClose={() => setShowReviewModal(false)}
        onSubmit={submitReview} loading={loading}
      />
      <PaymentSummaryModal
        show={showPaymentSummaryModal} paymentData={paymentData}
        onPayNow={handlePayNow} onClose={() => setShowPaymentSummaryModal(false)}
      />
      <PaymentMethodModal
        show={showPaymentMethodModal} paymentData={paymentData}
        onProcess={processUpfrontPayment}
        onClose={() => { setShowPaymentMethodModal(false); setPaymentData(null); }}
        onBack={() => { setShowPaymentMethodModal(false); setShowPaymentSummaryModal(true); }}
      />
      <RemainingPaymentModal
        show={showRemainingPaymentModal} remainingPaymentData={remainingPaymentData}
        onProcess={processRemainingPayment}
        onClose={() => { setShowRemainingPaymentModal(false); setRemainingPaymentData(null); }}
      />
    </main>
  );
}
