import { Link } from "react-router-dom";
import { buildImgUrl } from "../lib/tmdb";

export default function MovieCard({ movie }) {
  const title = movie.title || movie.name || "Untitled";
  const rating =
    typeof movie.vote_average === "number" ? movie.vote_average.toFixed(1) : "—";

  return (
    <Link to={`/movie/${movie.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="movie-card" style={cardStyle}>
        <div style={imgWrapStyle}>
          <img
            src={buildImgUrl(movie.poster_path)}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }}
            loading="lazy"
          />
        </div>
        <div style={{ padding: "8px 4px" }}>
          <h3 style={titleStyle} title={title}>{title}</h3>
          <p style={{ margin: 0, opacity: 0.8 }}>⭐ {rating}</p>
        </div>
      </div>
    </Link>
  );
}

const cardStyle = {
  borderRadius: 12,
  background: "#1f1f1f",
  boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
  overflow: "hidden",
};

const imgWrapStyle = {
  width: "100%",
  aspectRatio: "2/3",
  background: "#2a2a2a",
};

const titleStyle = {
  margin: "0 0 4px 0",
  fontSize: 16,
  lineHeight: 1.3,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};