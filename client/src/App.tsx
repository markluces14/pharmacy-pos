import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";

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
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Wrap all protected pages with Layout */}
          <Route
            element={
              <PrivateRoute allowedRoles={["admin", "manager", "cashier"]}>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
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
            <Route path="/feedback" element={<Feedback />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
