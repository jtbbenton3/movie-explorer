import SearchBar from "./SearchBar";

export default function AppHeader() {
  return (
    <header style={wrap}>
      <a href="/" style={logo}>📺 Show Explorer</a>
      <SearchBar />
    </header>
  );
}

const wrap = {
  position: "sticky",
  top: 0,
  zIndex: 10,
  display: "flex",
  gap: 16,
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 20px",
  background: "rgba(18,18,18,0.8)",
  backdropFilter: "blur(6px)",
  borderBottom: "1px solid #2c2c2c",
};

const logo = {
  fontWeight: 700,
  color: "white",
  textDecoration: "none",
  marginRight: 16,
};