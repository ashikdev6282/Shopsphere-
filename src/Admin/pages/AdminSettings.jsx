import React, { useState, useEffect } from "react";
import { Moon, Sun, Globe, Shield, Save, Upload } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Settings() {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@example.com",
    avatar: "",
  });

  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [accentColor, setAccentColor] = useState("blue");
  const [notifications, setNotifications] = useState({
    system: true,
    messages: true,
    orders: true,
    security: false,
  });
  const [twoFactor, setTwoFactor] = useState(false);

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result });
        toast.success("Profile photo updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8 text-gray-900 dark:text-gray-100 transition-all duration-300">
      <h2 className="text-3xl font-semibold mb-6">⚙️ Admin Settings</h2>

      {/* ===== Profile Section ===== */}
      <div className="glass-card mb-8 p-6 rounded-2xl shadow-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Profile Information</h3>

        <div className="flex items-center gap-6 mb-4">
          <img
            src={profile.avatar || "https://via.placeholder.com/80"}
            alt="Admin Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
          />
          <label className="cursor-pointer text-blue-600 hover:underline text-sm">
            <input
              type="file"
              className="hidden"
              onChange={handleAvatarUpload}
              accept="image/*"
            />
            <Upload className="inline-block w-4 h-4 mr-1" /> Change Photo
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            placeholder="Admin Name"
            className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
          />
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            placeholder="Email Address"
            className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
          />
        </div>
      </div>

      {/* ===== Preferences Section ===== */}
      <div className="glass-card mb-8 p-6 rounded-2xl shadow-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Preferences</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            {theme === "dark" ? (
              <Sun
                className="cursor-pointer"
                onClick={() => setTheme("light")}
              />
            ) : (
              <Moon
                className="cursor-pointer"
                onClick={() => setTheme("dark")}
              />
            )}
            <span>
              {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Globe />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            🎨
            <select
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            >
              <option value="blue">Blue</option>
              <option value="emerald">Emerald</option>
              <option value="purple">Purple</option>
              <option value="rose">Rose</option>
            </select>
            <span>Accent Color</span>
          </div>
        </div>
      </div>

      {/* ===== Notification Settings ===== */}
      <div className="glass-card mb-8 p-6 rounded-2xl shadow-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Notifications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(notifications).map(([key, value]) => (
            <label key={key} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={value}
                onChange={() =>
                  setNotifications({ ...notifications, [key]: !value })
                }
                className="w-4 h-4 accent-blue-600"
              />
              <span className="capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* ===== Security Section ===== */}
      <div className="glass-card mb-8 p-6 rounded-2xl shadow-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield /> Security
        </h3>
        <label className="flex items-center gap-3 mb-3">
          <input
            type="checkbox"
            checked={twoFactor}
            onChange={() => setTwoFactor(!twoFactor)}
            className="w-4 h-4 accent-green-600"
          />
          Enable Two-Factor Authentication
        </label>

        <button
          onClick={() => toast.success("Password reset link sent to email!")}
          className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          Reset Password
        </button>
      </div>

      {/* ===== Data & Activity Section ===== */}
      <div className="glass-card p-6 rounded-2xl shadow-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200 dark:border-gray-700 mb-20">
        <h3 className="text-xl font-semibold mb-4">Data Management</h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white transition">
            Export Data
          </button>
          <button
            onClick={() => toast.error("All data reset (simulation).")}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition"
          >
            Reset Data
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-300 dark:border-gray-600 pt-3">
          <p>Last Login: Oct 8, 2025, 9:23 AM</p>
          <p>Device: Chrome on Windows</p>
          <p>IP: 192.168.1.24</p>
        </div>
      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-xl transition-transform hover:scale-105"
        >
          <Save size={18} /> Save All Changes
        </button>
      </div>
    </div>
  );
}
