import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./screens/Profile";
import Home from "./screens/Home";
import SignIn from "./screens/auth/SignIn";
import SignUp from "./screens/auth/SignUp";
import CheckInbox from "./screens/auth/CheckInbox";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/checkinbox" element={<CheckInbox />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
