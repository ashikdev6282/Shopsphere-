// src/components/AdminProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminProtectedRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div className="text-center mt-20 text-gray-300">Checking authentication...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    console.log("ADMIN CHECK:", user);
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
