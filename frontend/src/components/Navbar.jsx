import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextValue";
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
      <div className="navbar-inner">
        <div className="brand">
          <Link to="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="logo-name">Rapihin.ai</span>
          </Link>
        </div>
        
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/upload">Upload</Link>
          {user ? (
            <>
              <Link to="/history">History</Link>
              <span className="user-greeting">Hi, {user.full_name || user.email}</span>
              <button onClick={handleLogout} className="link-logout">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
