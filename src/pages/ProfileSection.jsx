// src/pages/ProfilePage.jsx
import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  FaBox,
  FaHeart,
  FaBell,
  FaStar,
  FaMapMarkerAlt,
  FaCog,
} from "react-icons/fa";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase_config";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-300">
        Please log in to view your profile.
      </div>
    );
  }

  /* 🔐 LOGOUT WITH SWEETALERT */
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "You will be signed out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#4b5563",
      background: "#111827",
      color: "#f9fafb",
    });

    if (!result.isConfirmed) return;

    try {
      await signOut(auth);
      toast.success("Logged out successfully 👋");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 px-6 py-10 flex justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ---------------- LEFT PROFILE CARD ---------------- */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700 flex flex-col items-center"
        >
          <img
            src={user.avatar || "/default-user.png"}
            alt="avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-lg"
          />

          <h2 className="text-2xl font-bold mt-4">{user.name || "User"}</h2>
          <p className="text-gray-400">{user.email}</p>
          <p className="text-gray-400">{user.phone || "No phone added"}</p>

          <p className="text-gray-400 text-center mt-3">
            {user.address || "No address added"}
          </p>

          <button className="mt-5 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-medium transition">
            Edit Profile
          </button>

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center justify-center gap-2
                       bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white
                       py-2 rounded-lg font-medium transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </motion.div>

        {/* ---------------- RIGHT SIDE CONTENT ---------------- */}
        <div className="lg:col-span-2 space-y-10">

          {/* -------- ACCOUNT SUMMARY -------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700"
          >
            <h3 className="text-xl font-semibold mb-6">Account Overview</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <Stat icon={<FaBox />} label="Orders" value={user.orders || 0} />
              <Stat icon={<FaHeart />} label="Wishlist" value={user.wishlist || 0} />
              <Stat icon={<FaStar />} label="Reviews" value={8} />
              <Stat icon={<FaBell />} label="Notifications" value={3} />
            </div>
          </motion.div>

          {/* -------- QUICK ACTIONS -------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700"
          >
            <h3 className="text-xl font-semibold mb-6">My Shortcuts</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <Shortcut
                icon={<FaBox />}
                label="My Orders"
                onClick={() => navigate("/my-orders")}
              />
              <Shortcut icon={<FaHeart />} label="Wishlist" />
              <Shortcut icon={<FaStar />} label="Reviews" />
              <Shortcut icon={<FaCog />} label="Settings" />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

const Stat = ({ icon, label, value }) => (
  <div className="flex flex-col items-center">
    <div className="text-blue-400 text-3xl mb-2">{icon}</div>
    <p className="text-xl font-bold">{value}</p>
    <p className="text-gray-400 text-sm">{label}</p>
  </div>
);

const Shortcut = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="p-5 border border-gray-700 rounded-xl hover:bg-gray-700 transition flex flex-col items-center"
  >
    <div className="text-blue-400 text-3xl mb-2">{icon}</div>
    <span className="font-medium">{label}</span>
  </button>
);
