import { Link } from "react-router-dom";
import { buildImgUrl } from "../lib/tvmaze";

export default function MovieCard({ movie }) {
  // TVMaze shows
  const id = movie?.id;
  const title = movie?.name || movie?.title || "Untitled";
  const rating =
    typeof movie?.rating?.average === "number"
      ? movie.rating.average.toFixed(1)
      : "—";

  const image = buildImgUrl(movie?.image, "medium");

  const CardInner = (
    <div className="movie-card" style={cardStyle}>
      <div style={imgWrapStyle}>
        <img
          src={image}
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
  );

  
  return id
    ? (
      <Link to={`/movie/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
        {CardInner}
      </Link>
    )
    : (
      <div style={{ textDecoration: "none", color: "inherit", cursor: "default" }}>
        {CardInner}
      </div>
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