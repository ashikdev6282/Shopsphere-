// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);

  // Wait for Firebase to check auth state
  if (loading) {
    return <div className="text-center mt-20 text-gray-300">Checking authentication...</div>;
  }

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
