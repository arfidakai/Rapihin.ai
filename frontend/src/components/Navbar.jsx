import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/rapihin.png";
import "../style/style.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" className="logo-img" />
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <span className="logo">Rapihin.ai</span>
        </Link>
      </div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/upload">Upload</Link>
        {user ? (
          <>
            <Link to="/history">History</Link>
            <span style={{ color: "#666" }}>Hi, {user.full_name || user.email}</span>
            <button 
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                color: "#ff4444",
                cursor: "pointer",
                fontSize: "1rem",
                textDecoration: "underline"
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
