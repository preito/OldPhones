import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./screens/Profile";
import Home from "./screens/Home";
// import "../App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
