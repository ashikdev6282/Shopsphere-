import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiHome, FiBox, FiShoppingCart, FiUsers, FiSettings } from "react-icons/fi";

export default function Sidebar() {
  const { darkMode } = useSelector((state) => state.theme);
  const [isOpen, setIsOpen] = useState(false); // For mobile drawer
  const [isCollapsed, setIsCollapsed] = useState(false); // For tablet mini sidebar

  // Auto-collapse sidebar when window width is between md & lg
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const links = [
    { path: "/admin/dashboard", label: "Overview", icon: <FiHome /> },
    { path: "/admin/adminproduct", label: "Products", icon: <FiBox /> },
    { path: "/admin/adminorder", label: "Orders", icon: <FiShoppingCart /> },
    { path: "/admin/customers", label: "Customers", icon: <FiUsers /> },
    { path: "/admin/settings", label: "Settings", icon: <FiSettings /> },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className={`p-2 m-2 rounded-md lg:hidden ${
          darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full lg:h-auto z-40 transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        ${isCollapsed ? "w-20" : "w-64"} flex-shrink-0 p-4
        ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900 shadow"}
      `}
      >
        <h2 className={`font-bold mb-6 ${isCollapsed ? "hidden lg:block text-center" : "text-xl"}`}>
          {isCollapsed ? "AP" : "Admin Panel"}
        </h2>

        <nav className="flex flex-col space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)} // close drawer on mobile
              className={({ isActive }) =>
                `px-3 py-2 rounded-md flex items-center space-x-2 transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : darkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <span className="text-xl">{link.icon}</span>
              {!isCollapsed && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
