// src/lib/tvmaze.js
const BASE_URL = "https://api.tvmaze.com";


export function buildImgUrl(image, kind = "medium") {
  if (!image) return "/fallback.jpg";
  if (kind === "original") return image.original || image.medium || "/fallback.jpg";
  return image.medium || image.original || "/fallback.jpg";
}

export async function fetchJson(endpoint, params = {}, signal) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  });
  const res = await fetch(url, { signal });
  if (!res.ok) {
    let detail = "";
    try {
      const data = await res.json();
      if (data?.message) detail = ` - ${data.message}`;
    } catch {}
    throw new Error(`TVMaze error: ${res.status}${detail}`);
  }
  return res.json();
}