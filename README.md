# Show Explorer (React + Vite)

A lightweight React app for browsing **TV shows** using the public **TVMaze API** (no API key required).  
Users can see what’s airing today in the US, search for shows, and view a show detail page with cast.

**Live Demo:** https://jtbbenton3.github.io/movie-explorer/

---

## Table of Contents
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Local Setup](#local-setup)
- [How It Works](#how-it-works)
- [API & Endpoints](#api--endpoints)
- [Project Structure](#project-structure)
- [Known Limitations / Edge Cases](#known-limitations--edge-cases)
- [Grading Criteria Mapping](#grading-criteria-mapping)
- [License](#license)

---

## Features
- **Now Airing (US)** grid fetched from TVMaze “daily schedule”
- **Search** with debounced input, URL query syncing, and client-side pagination (“Load More”)
- **Show Detail** page with poster, year, rating, runtime, genres, summary, and **Top Billed Cast**
- **Error states** (network/API) with retry and **skeleton loading** placeholders
- **404 route** for unknown paths
- Deployed with **GitHub Pages** (Vite `base` + 404 fallback)

---

## Screenshots
- Home (Now Airing), Search (results + no-results), Detail, 404  
*(Add images if you’d like; not required.)*

---

## Tech Stack
- **React 19** + **Vite**
- **React Router**
- Fetch API for async requests
- Minimal inline styles, skeleton loaders, error banner

---

## Local Setup

```bash
# 1) Clone
git clone https://github.com/jtbbenton3/movie-explorer.git
cd movie-explorer

# 2) Install
npm install

# 3) Run dev server
npm run dev


# 4) Build
npm run build

# 5) Preview 
npm run preview