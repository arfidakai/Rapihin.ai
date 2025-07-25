import React from "react";
import logo from "../assets/rapihin.png";
import "../style/style.css";

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" className="logo-img" />
        <span className="logo">Rapihin.ai</span>
      </div>
      <nav className="nav-links">
        <a href="/" className="active">Home</a>
        <a href="/premium">Premium</a>
        <a href="/login">Login</a>
      </nav>
    </header>
  );
};

export default Navbar;
