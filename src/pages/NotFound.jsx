// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main style={{ padding: 40, maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ marginBottom: 12 }}>Page not found</h1>
      <p style={{ opacity: 0.8, marginBottom: 24 }}>
        The page you’re looking for doesn’t exist.
      </p>
      <Link to="/" style={btn}>← Go home</Link>
    </main>
  );
}

const btn = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #3a3a3a",
  background: "#191919",
  color: "white",
  textDecoration: "none",
  cursor: "pointer",
};