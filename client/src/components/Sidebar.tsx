import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div
      className="d-flex flex-column p-3 text-white"
      style={{
        width: "250px",
        height: "100vh",
        backgroundColor: "#2E4A70",
        position: "fixed",
        top: 0,
        left: 0,
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        className="d-flex align-items-center justify-content-center p-3 text-white text-decoration-none"
      >
        <img
          src="/img/logo_2.png" // remove `/public` — it refers to public root by default
          alt="Pharmalink POS Logo"
          style={{ height: "200px", width: "100%", objectFit: "contain" }}
        />
      </Link>
      {/* Scrollable content area */}
      <div className="flex-grow-1 overflow-auto px-3">
        <ul className="nav nav-pills flex-column mb-4 fs-4">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/products">
              Products
            </Link>
          </li>

          {user.role === "admin" && (
            <li className="nav-item">
              <Link className="nav-link text-white" to="/dashboard">
                Sales Report
              </Link>
            </li>
          )}

          {(user.role === "admin" || user.role === "manager") && (
            <li className="nav-item">
              <Link className="nav-link text-white" to="/inventory">
                Inventory
              </Link>
            </li>
          )}

          {user.role === "admin" && (
            <li className="nav-item">
              <Link className="nav-link text-white" to="/add-user">
                Add User
              </Link>
            </li>
          )}

          {(user.role === "admin" || user.role === "manager") && (
            <li className="nav-item">
              <Link className="nav-link text-white" to="/transactions">
                Transactions
              </Link>
            </li>
          )}

          <li className="nav-item">
            <Link className="nav-link text-white" to="/feedback">
              Feedback
            </Link>
          </li>
        </ul>
      </div>
      {/* Logout button fixed to bottom */}
      <div className="p-3">
        <button
          onClick={handleLogout}
          className="btn w-100"
          style={{
            backgroundColor: "#24B0BA",
            color: "#fff",
            border: "none",
          }}
        >
          Logout ({user.name})
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
