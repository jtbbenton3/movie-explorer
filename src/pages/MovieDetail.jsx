import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchJson, buildImgUrl } from "../lib/tvmaze";
import SkeletonCard from "../components/SkeletonCard";
import ErrorBanner from "../components/ErrorBanner";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); 
  const [error, setError] = useState(null);
  const [show, setShow] = useState(null);
  const [cast, setCast] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setStatus("loading");
        // Detail + embedded cast in one call
        const detail = await fetchJson(`/shows/${id}`, { embed: "cast" }, controller.signal);
        setShow(detail);
        const embeddedCast = Array.isArray(detail?._embedded?.cast) ? detail._embedded.cast : [];
        const topBilled = embeddedCast.slice(0, 10).map((c) => ({
          id: c?.person?.id || `${c?.person?.name}-${c?.character?.name}`,
          name: c?.person?.name || "—",
          character: c?.character?.name || "—",
          image: c?.person?.image || null,
        }));
        setCast(topBilled);
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
  const title = show?.name || "Untitled";
  const year = show?.premiered ? new Date(show.premiered).getFullYear() : "—";
  const runtime = typeof show?.runtime === "number" ? formatRuntime(show.runtime) : "—";
  const rating = typeof show?.rating?.average === "number" ? show.rating.average.toFixed(1) : "—";
  const genres = Array.isArray(show?.genres) ? show.genres.join(", ") : "—";
  const summaryText = stripHtml(show?.summary || "No summary available.");

  return (
    <main style={wrap}>
      <button onClick={() => navigate(-1)} style={backBtn}>← Back</button>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20 }}>
        <img
          src={buildImgUrl(show?.image, "original")}
          alt={title}
          style={{ width: 200, borderRadius: 12, objectFit: "cover", background: "#222" }}
        />

        <div>
          <h1 style={{ margin: "0 0 6px 0" }}>
            {title} <span style={{ opacity: 0.7, fontWeight: 400 }}>({year})</span>
          </h1>
          <p style={{ margin: "6px 0", opacity: 0.9 }}>
            ⭐ {rating} • {runtime} • {genres}
          </p>
          <p style={{ marginTop: 16, lineHeight: 1.6 }}>{summaryText}</p>
        </div>
      </div>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ margin: "0 0 12px 0", fontSize: 20 }}>Top Billed Cast</h2>
        <div style={castGrid}>
          {cast.map(person => (
            <div key={person.id} style={castCard}>
              <div style={{ width: "100%", aspectRatio: "2/3", background: "#222", borderRadius: 10, overflow: "hidden" }}>
                <img
                  src={buildImgUrl(person.image, "medium")}
                  alt={person.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontWeight: 600 }}>{person.name}</div>
                <div style={{ opacity: 0.8 }}>{person.character}</div>
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

function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
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