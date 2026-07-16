import {
  Home, Wrench, Stethoscope, GraduationCap, MapPin,
  LayoutDashboard, Shield, Star, CreditCard, MessageCircle,
  CalendarCheck, HelpCircle, LogOut,
  Briefcase, ClipboardList, DollarSign, AlertTriangle, Sun, Moon,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const userNavItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "services", label: "Services", icon: Wrench },
  { id: "doctors", label: "Doctors", icon: Stethoscope },
  { id: "tutors", label: "Tutors", icon: GraduationCap },
  { id: "nearby", label: "Nearby", icon: MapPin },
  { id: "dashboard", label: "My Bookings", icon: LayoutDashboard },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "appointments", label: "Appointments", icon: CalendarCheck },
  { id: "complaints", label: "Complaints", icon: AlertTriangle },
  { id: "help", label: "Help Center", icon: HelpCircle },
];

const providerNavItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "provider-dashboard", label: "My Dashboard", icon: LayoutDashboard },
  { id: "provider-bookings", label: "Bookings", icon: ClipboardList },
  { id: "services", label: "My Services", icon: Wrench },
  { id: "provider-earnings", label: "Earnings", icon: DollarSign },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "complaints", label: "Complaints", icon: AlertTriangle },
  { id: "help", label: "Help Center", icon: HelpCircle },
];

const adminNavItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "admin", label: "Admin Panel", icon: Shield },
  { id: "services", label: "Services", icon: Wrench },
  { id: "doctors", label: "Doctors", icon: Stethoscope },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "admin-complaints", label: "Complaints", icon: AlertTriangle },
  { id: "help", label: "Help Center", icon: HelpCircle },
];

function getNavItems(role) {
  switch (role) {
    case "admin":
      return adminNavItems;
    case "provider":
      return providerNavItems;
    default:
      return userNavItems;
  }
}

export default function Sidebar({ user, activePage, setActivePage, onLogout }) {
  const role = user?.role || "user";
  const items = getNavItems(role);
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      <div className="brand-row">
        <span>EthioService</span>
      </div>
      <nav>
        {items.map((item) => (
          <button
            key={item.id}
            className={activePage === item.id ? "active" : ""}
            onClick={() => setActivePage(item.id)}
          >
            <item.icon size={18} /> {item.label}
          </button>
        ))}
      </nav>
      <div style={{ display: "grid", gap: "6px", marginTop: "auto" }}>
        <button
          onClick={toggleTheme}
          style={{
            display: "flex", alignItems: "center", justifyContent: "flex-start",
            gap: "10px", padding: "0 12px", minHeight: "42px",
            background: "transparent", color: "#dce9e5", border: "none",
            borderRadius: "8px", cursor: "pointer", fontWeight: 700, fontSize: "14px",
            width: "100%", fontFamily: "inherit"
          }}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
        <button onClick={onLogout} className="logout">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
