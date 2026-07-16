import { Component } from "react";
import { AlertTriangle } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "grid",
          placeItems: "center",
          minHeight: "400px",
          padding: "40px 20px",
          textAlign: "center",
          gap: "16px"
        }}>
          <AlertTriangle size={48} color="#f59e0b" />
          <h2 style={{ color: "var(--text)", margin: 0 }}>Something went wrong</h2>
          <p style={{ color: "var(--muted)", maxWidth: "400px" }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              padding: "12px 24px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "700"
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
