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
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Pharmacy POS
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/products">
                    Products
                  </Link>
                </li>
                {(user.role === "admin" || user.role === "manager") && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/inventory">
                      Inventory
                    </Link>
                  </li>
                )}
                {user.role === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/add-user">
                      Add User
                    </Link>
                  </li>
                )}
                {(user.role === "admin" || user.role === "manager") && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/transactions">
                      Transactions
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/feedback">
                    Feedback
                  </Link>
                </li>
              </>
            )}
          </ul>
          {user && (
            <button className="btn btn-outline-light" onClick={handleLogout}>
              Logout ({user.name})
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
