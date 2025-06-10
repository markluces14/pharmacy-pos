import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg mb-4"
      style={{ backgroundColor: "#2E4A70" }}
    >
      <div className="container">
        <Link className="navbar-brand text-white fw-bold" to="/">
          Pharmalink POS
        </Link>

        {user && (
          <div className="collapse navbar-collapse show">
            <ul className="navbar-nav me-auto">
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

            <button
              onClick={handleLogout}
              className="btn btn-sm"
              style={{
                backgroundColor: "#24B0BA",
                color: "#fff",
                border: "none",
              }}
            >
              Logout ({user.name})
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
