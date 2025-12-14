import React, { useEffect, useState } from "react";
import { Moon, Sun, Globe, Shield, Save, Upload, LogOut } from "lucide-react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase/firebase_config";
import { doc, updateDoc } from "firebase/firestore";
import { clearUser } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function AdminSettings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔥 Admin from Redux (Firestore-backed)
  const admin = useSelector((state) => state.auth.user);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [twoFactor, setTwoFactor] = useState(false);

  /* ================= LOAD ADMIN PROFILE ================= */
  useEffect(() => {
    if (admin) {
      setProfile({
        name: admin.name || "",
        email: admin.email || "",
        avatar: admin.avatar || "",
      });
    }
  }, [admin]);

  /* ================= THEME HANDLING ================= */
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  /* ================= PROFILE CHANGE ================= */
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, avatar: reader.result }));
      toast.success("Avatar updated (local)");
    };
    reader.readAsDataURL(file);
  };

  /* ================= SAVE PROFILE ================= */
  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "users", admin.uid), {
        name: profile.name,
        avatar: profile.avatar,
      });

      toast.success("Admin profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout Admin?",
      text: "You will be logged out from the admin dashboard.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Logout",
    });

    if (!result.isConfirmed) return;

    try {
      await signOut(auth);
      dispatch(clearUser());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };

  if (!admin) {
    return (
      <div className="p-10 text-center text-gray-400">
        Loading admin settings...
      </div>
    );
  }

  return (
    <div className="p-8 text-gray-900 dark:text-gray-100 transition-all">
      <h2 className="text-3xl font-semibold mb-6">⚙️ Admin Settings</h2>

      {/* ================= PROFILE ================= */}
      <div className="mb-8 p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur border">
        <h3 className="text-xl font-semibold mb-4">Admin Profile</h3>

        <div className="flex items-center gap-6 mb-4">
          <img
            src={profile.avatar || "https://via.placeholder.com/100"}
            alt="Admin Avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <label className="cursor-pointer text-blue-600 text-sm">
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleAvatarUpload}
            />
            <Upload className="inline w-4 h-4 mr-1" />
            Change Photo
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            placeholder="Admin Name"
            className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
          />
          <input
            type="email"
            value={profile.email}
            disabled
            className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
          />
        </div>
      </div>

      {/* ================= PREFERENCES ================= */}
      <div className="mb-8 p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur border">
        <h3 className="text-xl font-semibold mb-4">Preferences</h3>

        <div className="flex items-center gap-6 mb-4">
          {theme === "dark" ? (
            <Sun onClick={() => setTheme("light")} className="cursor-pointer" />
          ) : (
            <Moon onClick={() => setTheme("dark")} className="cursor-pointer" />
          )}
          <span>
            {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Globe />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
      </div>

      {/* ================= SECURITY ================= */}
      <div className="mb-8 p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield /> Security
        </h3>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={twoFactor}
            onChange={() => setTwoFactor(!twoFactor)}
          />
          Enable Two-Factor Authentication
        </label>
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white"
        >
          <Save size={18} /> Save Changes
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-white"
        >
          <LogOut size={18} /> Logout Admin
        </button>
      </div>
    </div>
  );
}
