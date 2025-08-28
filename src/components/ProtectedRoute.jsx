import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("usuario"));
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.rol !== role) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
