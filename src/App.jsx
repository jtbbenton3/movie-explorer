import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomeTrending from "./pages/HomeTrending";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home route shows trending movies */}
        <Route path="/" element={<HomeTrending />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;