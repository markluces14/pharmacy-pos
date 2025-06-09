import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Product";
import Inventory from "./pages/Inventory";
import AddUser from "./pages/AddUser";
import Feedback from "./pages/Feedback";
import Transactions from "./pages/Transaction";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <PrivateRoute allowedRoles={["admin", "manager", "cashier"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={["admin", "manager", "cashier"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/products"
            element={
              <PrivateRoute allowedRoles={["admin", "manager", "cashier"]}>
                <Products />
              </PrivateRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <PrivateRoute allowedRoles={["admin", "manager"]}>
                <Inventory />
              </PrivateRoute>
            }
          />

          <Route
            path="/add-user"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AddUser />
              </PrivateRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <PrivateRoute allowedRoles={["admin", "manager"]}>
                <Transactions />
              </PrivateRoute>
            }
          />

          <Route
            path="/feedback"
            element={
              <PrivateRoute allowedRoles={["admin", "manager", "cashier"]}>
                <Feedback />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
