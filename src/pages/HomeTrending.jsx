import { useEffect, useMemo, useState } from "react";
import { fetchJson } from "../lib/tvmaze";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import ErrorBanner from "../components/ErrorBanner";

export default function HomeTrending() {
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [shows, setShows] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");

    // Today's date in YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    // TVMaze: daily schedule
    fetchJson("/schedule", { country: "US", date: dateStr }, controller.signal)
      .then((data) => {
        // Items look like { id, name (episode), show: { ... } }
        const map = new Map();
        (Array.isArray(data) ? data : []).forEach((item) => {
          const show = item?.show;
          if (show?.id && !map.has(show.id)) map.set(show.id, show);
        });
        setShows(Array.from(map.values()));
        setStatus("success");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Unknown error");
        setStatus("error");
      });

    return () => controller.abort();
  }, []);

  const content = useMemo(() => {
    if (status === "loading") {
      return (
        <div style={grid}>
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }
    if (status === "error") {
      return <ErrorBanner message={error} onRetry={() => location.reload()} />;
    }
    if (!shows.length) {
      return <p style={{ opacity: 0.8, textAlign: "center" }}>No shows airing today.</p>;
    }
    return (
      <div style={grid}>
        {shows.map((s) => <MovieCard key={s.id} movie={s} />)}
      </div>
    );
  }, [status, error, shows]);

  return (
    <main style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 16 }}>Now Airing (US)</h1>
      {content}
    </main>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  gap: 16,
};