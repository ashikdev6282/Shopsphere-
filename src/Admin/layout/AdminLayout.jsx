// src/Admin/layout/AdminLayout.jsx
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AdminLayout() {
  const { darkMode } = useSelector((state) => state.theme || { darkMode: true });

  return (
    <div className={darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          <Topbar />
          <main className="p-4 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
