const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_KEY;

export function buildImgUrl(path, size = "w342") {
  // TMDB image base. Common sizes: w200, w342, w500, original
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : "/fallback.jpg";
}

export async function fetchJson(endpoint, params = {}, signal) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}