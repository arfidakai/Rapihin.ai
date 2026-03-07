import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import "../style/style.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({ top: section.offsetTop - 80, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <Link to="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="logo-name">Rapihin.ai</span>
          </Link>
        </div>
        
        {/* Desktop Nav */}
        <nav className="nav-links">
          <a href="#section-hero" onClick={(e) => { e.preventDefault(); scrollToSection('section-hero'); }} style={{ cursor: 'pointer' }}>Home</a>
          <a href="#section-join" onClick={(e) => { e.preventDefault(); scrollToSection('section-join'); }} style={{ cursor: 'pointer' }}>How it Works</a>
          <a href="#section-reviews" onClick={(e) => { e.preventDefault(); scrollToSection('section-reviews'); }} style={{ cursor: 'pointer' }}>Reviews</a>
          {user ? (
            <>
              <Link to="/history">History</Link>
              <span className="user-greeting">Hi, {user.full_name || user.email}</span>
              <button onClick={handleLogout} className="link-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn-login">
                Login
              </button>
              <button onClick={() => navigate('/upload')} className="btn-get-started">
                Get Started
              </button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <a href="#section-hero" onClick={(e) => { e.preventDefault(); scrollToSection('section-hero'); }}>Home</a>
          <a href="#section-join" onClick={(e) => { e.preventDefault(); scrollToSection('section-join'); }}>How it Works</a>
          <a href="#section-reviews" onClick={(e) => { e.preventDefault(); scrollToSection('section-reviews'); }}>Reviews</a>
          {user ? (
            <>
              <Link to="/history" onClick={() => setMobileMenuOpen(false)}>History</Link>
              <span className="user-greeting">Hi, {user.full_name || user.email}</span>
              <button onClick={handleLogout} className="link-logout" style={{ width: '100%', marginTop: '1rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} className="btn-login" style={{ width: '100%', marginTop: '1rem' }}>
                Login
              </button>
              <button onClick={() => { setMobileMenuOpen(false); navigate('/upload'); }} className="btn-get-started" style={{ width: '100%', marginTop: '0.5rem' }}>
                Get Started
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
