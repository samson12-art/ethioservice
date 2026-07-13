import { X } from "lucide-react";

export default function DismissibleAlert({ message, onClose, wide = false, type = "error" }) {
  if (!message) return null;
  return (
    <div className={`alert ${wide ? "wide" : ""} ${type === "success" ? "success" : ""}`} role="status">
      <span>{message}</span>
      <button type="button" className="alert-close" aria-label="Close" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
}
