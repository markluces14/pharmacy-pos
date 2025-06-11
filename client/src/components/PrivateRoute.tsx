import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  allowedRoles: string[];
  children: React.ReactElement;
}

const PrivateRoute = ({ allowedRoles, children }: PrivateRouteProps) => {
  const { user, loading } = useAuth();

  // Wait for session check to complete
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner if you want
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/not-found" replace />;
  }

  return children;
};

export default PrivateRoute;
