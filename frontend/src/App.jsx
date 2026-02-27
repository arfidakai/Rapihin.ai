import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import UploadPage from "./pages/UploadPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import History from "./pages/History";
import Info from "./pages/Info";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/history" element={<History />} />
          <Route path="/info" element={<Info />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;


