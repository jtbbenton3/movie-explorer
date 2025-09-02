import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import AppHeader from "./components/AppHeader";
import HomeTrending from "./pages/HomeTrending";
import SearchResults from "./pages/SearchResults";
import MovieDetail from "./pages/MovieDetail"; 

export default function App() {
  return (
    <BrowserRouter>
      <AppHeader />
      <Routes>
        <Route path="/" element={<HomeTrending />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/movie/:id" element={<MovieDetail />} /> 
      </Routes>
    </BrowserRouter>
  );
}