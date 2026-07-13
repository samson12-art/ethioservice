import { useState } from "react";
import { ChevronDown, Mail, Phone, CalendarCheck, CreditCard, Wallet, ShieldCheck, Zap } from "lucide-react";

const faqs = [
  { question: "How to book?", answer: 'Click "Book" on any service.', icon: <CalendarCheck size={20} /> },
  { question: "How does payment work?", answer: "Pay 5.95% upfront to secure booking, remaining after completion.", icon: <CreditCard size={20} /> },
  { question: "Payment Methods", answer: "Telebirr, Chapa, Cash", icon: <Wallet size={20} /> },
  { question: "What is the upfront fee?", answer: "0.95% platform fee + 5% booking guarantee (non-refundable)", icon: <ShieldCheck size={20} /> },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
      <div className="panel">
        <h2>FAQs & Support</h2>
        <p className="muted" style={{ marginBottom: "20px" }}>Find answers quickly or contact our team</p>
        {faqs.map((faq, i) => (
          <div key={i} className="faq-item">
            <button onClick={() => setOpenIndex(openIndex === i ? null : i)}>
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {faq.icon} {faq.question}
              </span>
              <ChevronDown size={18} style={{ transform: openIndex === i ? "rotate(180deg)" : "rotate(0)", transition: "0.2s" }} />
            </button>
            {openIndex === i && <div className="faq-answer">{faq.answer}</div>}
          </div>
        ))}
      </div>
      <div className="contact-panel">
        <h2 style={{ marginBottom: "16px" }}>Contact Support</h2>
        <div className="contact-box">
          <Mail size={20} style={{ color: "var(--accent)", flexShrink: 0 }} />
          <div>
            <p style={{ fontWeight: "700", fontSize: "13px" }}>Email</p>
            <p style={{ fontSize: "13px" }}>support@ethioservice.com</p>
          </div>
        </div>
        <div className="contact-box">
          <Phone size={20} style={{ color: "var(--accent)", flexShrink: 0 }} />
          <div>
            <p style={{ fontWeight: "700", fontSize: "13px" }}>Phone</p>
            <p style={{ fontSize: "13px" }}>+251-911-123-456</p>
          </div>
        </div>
      </div>
    </div>
  );
}
