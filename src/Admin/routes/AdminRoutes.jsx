import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminDashboard from "../pages/Dashboard";
import AdminProducts from "../pages/AdminProduct";
import AdminOrders from "../pages/AdminOrders";
import AdminCustomers from "../pages/AdminCustomer";
import AdminSettings from "../pages/AdminSettings";


export default function AdminRoutes() {
    return (
        <AdminLayout>
            <Routes>
                <Route path="/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
                <Route path="/adminproduct" element={<AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>} />
                <Route path="/adminorder" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />
                <Route path="/customers" element={<AdminProtectedRoute><AdminCustomers /></AdminProtectedRoute>} />
                <Route path="/settings" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />
            </Routes>
        </AdminLayout>
    )
}