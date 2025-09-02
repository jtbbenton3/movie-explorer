export default function ErrorBanner({ message, onRetry }) {
  return (
    <div style={wrap}>
      <p style={{ margin: 0, fontWeight: 600 }}>Something went wrong.</p>
      <p style={{ margin: "6px 0 12px 0", opacity: 0.8 }}>{message}</p>
      {!!onRetry && (
        <button onClick={onRetry} style={btn}>Retry</button>
      )}
    </div>
  );
}

const wrap = {
  border: "1px solid #ff4d4f",
  background: "rgba(255,77,79,0.1)",
  padding: 16,
  borderRadius: 10,
  color: "#ffadad",
  maxWidth: 520,
  margin: "24px auto",
  textAlign: "center",
};

const btn = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #ff4d4f",
  background: "transparent",
  color: "#ffadad",
  cursor: "pointer",
};