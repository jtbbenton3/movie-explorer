import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchJson, buildImgUrl } from "../lib/tmdb";
import SkeletonCard from "../components/SkeletonCard";
import ErrorBanner from "../components/ErrorBanner";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); 
  const [error, setError] = useState(null);
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setStatus("loading");
        
        const [detail, creditData] = await Promise.all([
          fetchJson(`/movie/${id}`, {}, controller.signal),
          fetchJson(`/movie/${id}/credits`, {}, controller.signal),
        ]);
        setMovie(detail);
        setCredits(creditData);
        setStatus("success");
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "Unknown error");
        setStatus("error");
      }
    }

    load();
    return () => controller.abort();
  }, [id]);

  if (status === "loading") {
    return (
      <main style={wrap}>
        <button onClick={() => navigate(-1)} style={backBtn}>← Back</button>
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20 }}>
          <div style={{ borderRadius: 12, overflow: "hidden" }}><SkeletonCard /></div>
          <div>
            <div className="skeleton" style={{ height: 28, width: "60%", borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 16, width: "40%", marginTop: 10, borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 100, width: "100%", marginTop: 16, borderRadius: 8 }} />
          </div>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main style={wrap}>
        <button onClick={() => navigate(-1)} style={backBtn}>← Back</button>
        <ErrorBanner message={error} onRetry={() => navigate(0)} />
      </main>
    );
  }

  // SUCCESS
  const year = movie?.release_date ? new Date(movie.release_date).getFullYear() : "—";
  const runtime = typeof movie?.runtime === "number" ? formatRuntime(movie.runtime) : "—";
  const rating = typeof movie?.vote_average === "number" ? movie.vote_average.toFixed(1) : "—";
  const genres = Array.isArray(movie?.genres) ? movie.genres.map(g => g.name).join(", ") : "—";
  const cast = Array.isArray(credits?.cast) ? credits.cast.slice(0, 10) : [];

  return (
    <main style={wrap}>
      <button onClick={() => navigate(-1)} style={backBtn}>← Back</button>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20 }}>
        <img
          src={buildImgUrl(movie.poster_path, "w342")}
          alt={movie.title}
          style={{ width: 200, borderRadius: 12, objectFit: "cover", background: "#222" }}
        />

        <div>
          <h1 style={{ margin: "0 0 6px 0" }}>
            {movie.title} <span style={{ opacity: 0.7, fontWeight: 400 }}>({year})</span>
          </h1>
          <p style={{ margin: "6px 0", opacity: 0.9 }}>
            ⭐ {rating} • {runtime} • {genres}
          </p>
          <p style={{ marginTop: 16, lineHeight: 1.6 }}>{movie.overview || "No overview available."}</p>
        </div>
      </div>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ margin: "0 0 12px 0", fontSize: 20 }}>Top Billed Cast</h2>
        <div style={castGrid}>
          {cast.map(person => (
            <div key={person.id} style={castCard}>
              <div style={{ width: "100%", aspectRatio: "2/3", background: "#222", borderRadius: 10, overflow: "hidden" }}>
                <img
                  src={buildImgUrl(person.profile_path, "w185")}
                  alt={person.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontWeight: 600 }}>{person.name}</div>
                <div style={{ opacity: 0.8 }}>{person.character || "—"}</div>
              </div>
            </div>
          ))}
          {cast.length === 0 && <p style={{ opacity: 0.8 }}>No cast listed.</p>}
        </div>
      </section>
    </main>
  );
}

function formatRuntime(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (!h) return `${m}m`;
  if (!m) return `${h}h`;
  return `${h}h ${m}m`;
}

const wrap = { padding: 20, maxWidth: 1200, margin: "0 auto" };
const backBtn = {
  marginBottom: 16,
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #3a3a3a",
  background: "#191919",
  color: "white",
  cursor: "pointer",
};
const castGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  gap: 16,
};
const castCard = {
  borderRadius: 12,
  background: "#1a1a1a",
  padding: 10,
};