import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchJson } from "../lib/tvmaze";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import ErrorBanner from "../components/ErrorBanner";

const PAGE_SIZE = 24;

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const query = (params.get("q") || "").trim();

  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [allResults, setAllResults] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(Number(params.get("page") || "1"));

  useEffect(() => {
    if (!query) {
      setStatus("idle");
      setAllResults([]);
      setPage(1);
      return;
    }
    const controller = new AbortController();
    setStatus("loading");
    setPage(1);

    // TVMaze search: [{ score, show }]
    fetchJson("/search/shows", { q: query }, controller.signal)
      .then((data) => {
        const shows = (Array.isArray(data) ? data : [])
          .map((d) => d.show)
          .filter(Boolean);
        setAllResults(shows);
        setStatus("success");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Unknown error");
        setStatus("error");
      });

    return () => controller.abort();
  }, [query]);

  // Keep URL page param in sync when page changes
  useEffect(() => {
    if (!query) return;
    setParams({ q: query, page: String(page) }, { replace: true });
  }, [query, page, setParams]);

  const totalPages = Math.max(1, Math.ceil(allResults.length / PAGE_SIZE));
  const visible = useMemo(() => {
    const end = page * PAGE_SIZE;
    return allResults.slice(0, end);
  }, [allResults, page]);

  const content = useMemo(() => {
    if (!query) {
      return <p style={{ opacity: 0.8, textAlign: "center" }}>Type in the search box to find shows.</p>;
    }
    if (status === "loading" && page === 1) {
      return (
        <div style={grid}>
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }
    if (status === "error") {
      return <ErrorBanner message={error} onRetry={() => setPage(1)} />;
    }
    if (visible.length === 0) {
      return <p style={{ opacity: 0.8, textAlign: "center" }}>No results for “{query}”.</p>;
    }
    return (
      <>
        <div style={grid}>
          {visible.map((m) => <MovieCard key={m.id} movie={m} />)}
        </div>
        {status === "loading" && page > 1 && (
          <div style={{ marginTop: 16 }}>
            <p style={{ opacity: 0.7, textAlign: "center" }}>Loading more…</p>
          </div>
        )}
        {page < totalPages && status !== "loading" && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <button onClick={() => setPage((p) => p + 1)} style={btn}>Load More</button>
          </div>
        )}
      </>
    );
  }, [query, status, error, visible, page, totalPages]);

  return (
    <main style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 12 }}>Search Results</h1>
      {content}
    </main>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  gap: 16,
};

const btn = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #3a3a3a",
  background: "#191919",
  color: "white",
  cursor: "pointer",
};