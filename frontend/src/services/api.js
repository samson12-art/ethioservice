import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  getMe: () => API.get("/auth/me"),
};

export const serviceAPI = {
  getAll: (params) => API.get("/services", { params }),
  getDoctors: (params) => API.get("/services/doctors", { params }),
};

export const bookingAPI = {
  create: (data) => API.post("/bookings", data),
  getMyBookings: () => API.get("/bookings/my-bookings"),
};

export default API;
