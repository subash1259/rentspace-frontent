import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/navbar.css";
import {
  FaHome, FaSearch, FaBalanceScale,
  FaUser, FaUserTie, FaBars, FaTimes
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "active" : "";

  const { user, logout } = useAuth();
  const navigate         = useNavigate();

const handleLogout = () => {
  logout();
  navigate("/login");
};

  return (
    <nav className="navbar">

      <Link to="/" className="nav-logo">RentSpace</Link>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" className={isActive("/")}>
          <FaHome /> Home
        </Link>
        <Link to="/listings" className={isActive("/listings")}>
          <FaSearch /> Rentals
        </Link>
        <Link to="/compare" className={isActive("/compare")}>
          <FaBalanceScale /> Compare
        </Link>
        <Link to="/user-dashboard" className={isActive("/user-dashboard")}>
          <FaUser /> My Account
        </Link>
        <Link to="/owner-dashboard" className={isActive("/owner-dashboard")}>
          <FaUserTie /> Owner
        </Link>
      </div>

      <div className="nav-right">
  {user ? (
    <>
      <span className="nav-username">
        👤 {user.username}
      </span>
      {user.role === "owner" ? (
        <Link to="/ownerdashboard" className="nav-login">
          Dashboard
        </Link>
      ) : (
        <Link to="/userdashboard" className="nav-login">
          Dashboard
        </Link>
      )}
      <button
        className="nav-register"
        onClick={handleLogout}
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link to="/login"    className="nav-login">Login</Link>
      <Link to="/register" className="nav-register">Register</Link>
    </>
  )}
  <button
    className="nav-hamburger"
    onClick={() => setMenuOpen(o => !o)}
  >
    {menuOpen ? <FaTimes /> : <FaBars />}
  </button>
</div>

    </nav>
  );
}

export default NavBar;
