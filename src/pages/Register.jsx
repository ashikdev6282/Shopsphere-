// src/pages/Register.jsx
import React, { useState } from "react";
import { User, Mail, Lock, Phone, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

/* Firebase */
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../firebase/firebase_config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (formData.name.length < 3) {
      toast.error("Name must be at least 3 characters");
      return false;
    }
    if (!formData.email.includes("@")) {
      toast.error("Enter a valid email");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      // 1️⃣ Create Auth Account
      const cred = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // 2️⃣ Create Firestore User Profile
      await setDoc(doc(db, "users", cred.user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: "user",
        avatar: "",
        createdAt: serverTimestamp(),
        provider: "password",
      });

      // 3️⃣ Email Verification
      await sendEmailVerification(cred.user);

      toast.success("Account created! Verify your email 📩");

      // Redirect handled by auth listener
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        toast.error("Email already registered");
      } else {
        toast.error("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 via-black to-zinc-950 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-transparent border-b-2 border-gray-600 pl-10 py-2 text-white focus:border-green-500 focus:outline-none"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-transparent border-b-2 border-gray-600 pl-10 py-2 text-white focus:border-green-500 focus:outline-none"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400" />
            <input
              type="tel"
              placeholder="Phone (optional)"
              className="w-full bg-transparent border-b-2 border-gray-600 pl-10 py-2 text-white focus:border-green-500 focus:outline-none"
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-transparent border-b-2 border-gray-600 pl-10 pr-10 py-2 text-white focus:border-green-500 focus:outline-none"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white font-semibold"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
