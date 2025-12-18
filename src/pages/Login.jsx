// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import Loginimage from "../assets/images/loginimage.png";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/firebase_config";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const { isAuthenticated, loading, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated && user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }

    if (isAuthenticated && user?.role !== "admin") {
      navigate("/homepage", { replace: true });
    }
  }, [isAuthenticated, user, loading, navigate]);

  /* 🔐 EMAIL LOGIN */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      toast.success("Login successful 🎉");
    } catch (err) {
      console.error(err);
      toast.error("Invalid email or password ❌");
    }
  };

  /* 🔐 GOOGLE LOGIN */
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Logged in with Google 🎉");
    } catch (err) {
      console.error(err);
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-x-hidden">
      {/* LEFT SIDE */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 bg-gradient-to-br from-blue-700 via-purple-800 to-indigo-900 flex flex-col items-center justify-center p-8 text-white"
      >
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-4xl font-bold">Welcome Back!</h1>
          <p className="text-lg opacity-90">
            Login to your account and continue exploring.
          </p>
          <img
            src={Loginimage}
            alt="Login Illustration"
            className="w-72 mx-auto drop-shadow-2xl mt-8 rounded-full border-4 border-white/20"
          />
        </div>
      </motion.div>

      {/* RIGHT FORM */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-b from-zinc-900 via-black to-zinc-950 p-6"
      >
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-extrabold text-white text-center mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="email"
                className="w-full bg-transparent border-b-2 border-gray-600 pl-10 pr-3 pt-3 pb-2 text-white focus:border-blue-500 focus:outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <label className="absolute left-10 top-1 text-gray-400 text-sm">
                Email
              </label>
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />

              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-transparent border-b-2 border-gray-600 pl-10 pr-10 pt-3 pb-2 text-white focus:border-purple-500 focus:outline-none"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />

              {/* 👁 TOGGLE */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

              <label className="absolute left-10 top-1 text-gray-400 text-sm">
                Password
              </label>

              <div className="text-right text-sm mt-1">
                <Link
                  to="/forgot-password"
                  className="text-blue-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition text-white font-semibold"
            >
              Login
            </motion.button>
          </form>

          {/* SOCIAL */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm mb-4">Or sign in with</p>
            <button
              onClick={handleGoogleLogin}
              className="p-3 bg-white rounded-full shadow-lg hover:scale-110 transition"
            >
              <FcGoogle size={22} />
            </button>
          </div>

          <p className="text-gray-400 text-sm text-center mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
