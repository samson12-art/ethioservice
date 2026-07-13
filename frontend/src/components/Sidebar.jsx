import {
  Home, Wrench, Stethoscope, GraduationCap, MapPin,
  LayoutDashboard, Shield, Star, CreditCard, MessageCircle,
  CalendarCheck, HelpCircle, LogOut,
  Briefcase, ClipboardList, DollarSign,
} from "lucide-react";

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
  { id: "help", label: "Help Center", icon: HelpCircle },
];

const providerNavItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "dashboard", label: "My Dashboard", icon: LayoutDashboard },
  { id: "provider-bookings", label: "Bookings", icon: ClipboardList },
  { id: "services", label: "My Services", icon: Wrench },
  { id: "provider-earnings", label: "Earnings", icon: DollarSign },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "messages", label: "Messages", icon: MessageCircle },
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

  return (
    <aside className="sidebar">
      <div className="brand-row">
        <span>🇪🇹</span>
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
      <button onClick={onLogout} className="logout">
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
