import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useDebouncedValue from "../hooks/useDebouncedValue";

export default function SearchBar() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  
  const initial = location.pathname.startsWith("/search") ? (params.get("q") || "") : "";
  const [text, setText] = useState(initial);
  const debounced = useDebouncedValue(text, 400);

  
  
  useEffect(() => {
    const q = debounced.trim();
    if (q.length === 0) return;

    const canNavigateFromHere =
      location.pathname === "/" || location.pathname.startsWith("/search");

    if (!canNavigateFromHere) return;

    navigate(`/search?q=${encodeURIComponent(q)}&page=1`, {
      
      replace: location.pathname.startsWith("/search"),
    });
  }, [debounced, navigate, location.pathname]);

  
  useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      setText("");
    } else {
      
      const urlQ = params.get("q") || "";
      if (urlQ !== text) setText(urlQ);
    }
    
  }, [location.pathname, params]);

  return (
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Search shows…"
      aria-label="Search shows"
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