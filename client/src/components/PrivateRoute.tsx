import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  allowedRoles: string[]; // ✅ Define allowedRoles
  children: React.ReactElement;
}

const PrivateRoute = ({ allowedRoles, children }: PrivateRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/not-found" replace />;
  }

  return children;
};

export default PrivateRoute;
