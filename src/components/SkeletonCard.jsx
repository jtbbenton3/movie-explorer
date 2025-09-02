export default function SkeletonCard() {
  return (
    <div style={outer}>
      <div style={thumb} className="skeleton" />
      <div style={{ padding: "8px 4px" }}>
        <div style={line} className="skeleton" />
        <div style={{ ...line, width: "40%" }} className="skeleton" />
      </div>
    </div>
  );
}

const outer = {
  borderRadius: 12,
  background: "#1f1f1f",
  overflow: "hidden",
};

const thumb = {
  width: "100%",
  aspectRatio: "2/3",
  background: "#2a2a2a",
};

const line = {
  height: 12,
  marginTop: 6,
  borderRadius: 6,
  background: "#2a2a2a",
};