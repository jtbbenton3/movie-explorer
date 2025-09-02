import { useEffect, useMemo, useState } from "react";
import { fetchJson } from "../lib/tmdb";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import ErrorBanner from "../components/ErrorBanner";

export default function HomeTrending() {
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  // abort controller to avoid leaks on fast reloads
  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    fetchJson("/trending/movie/day", { page: 1 }, controller.signal)
      .then((data) => {
        setMovies(Array.isArray(data?.results) ? data.results : []);
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
    if (!movies.length) {
      return <p style={{ opacity: 0.8, textAlign: "center" }}>No trending movies right now.</p>;
    }
    return (
      <div style={grid}>
        {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
      </div>
    );
  }, [status, error, movies]);

  return (
    <main style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 16 }}>Trending Movies</h1>
      {content}
    </main>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  gap: 16,
};