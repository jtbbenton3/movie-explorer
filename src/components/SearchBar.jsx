import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useDebouncedValue from "../hooks/useDebouncedValue";

export default function SearchBar() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [text, setText] = useState(params.get("q") || "");
  const debounced = useDebouncedValue(text, 400);

  // When user stops typing, update the URL to /search?q=...
  useEffect(() => {
    // If empty, don't navigate to /search—stay on whatever page.
    if (debounced.trim().length === 0) return;
    navigate(`/search?q=${encodeURIComponent(debounced)}&page=1`);
  }, [debounced, navigate]);

  return (
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Search movies…"
      aria-label="Search movies"
      style={inputStyle}
    />
  );
}

const inputStyle = {
  width: "100%",
  maxWidth: 520,
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #3a3a3a",
  background: "#121212",
  color: "white",
  outline: "none",
};