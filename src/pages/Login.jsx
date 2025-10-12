// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaGithub } from "react-icons/fa";
import Loginimage from "../assets/images/loginimage.png";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });


  const { isAuthenticated, role } = useSelector((state) => state.auth);


  useEffect(() => {
    if (isAuthenticated) {
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/homepage");
      }
    }
  } , [isAuthenticated, role, navigate]);



  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-x-hidden">
      {/* Left visual section */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full md:w-1/2 bg-gradient-to-br from-blue-700 via-purple-800 to-indigo-900 items-center justify-center p-8 text-white flex flex-col"
      >
        <div className="text-center space-y-6 max-w-md">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl font-bold"
          >
            Welcome Back!
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg opacity-90"
          >
            Login to your account and continue exploring your dashboard.
          </motion.p>
          <motion.img
            src={Loginimage}
            alt="Login Illustration"
            className="w-72 mx-auto drop-shadow-2xl animate-bounce mt-8 mb-4 rounded-full border-4 border-white/20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 80 }}
          />
        </div>
      </motion.div>

      {/* Right login form */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-b from-zinc-900 via-black to-zinc-950 p-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8"
        >
          {/* Branding / Logo */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-white">Login</h2>
            <p className="text-gray-400 text-sm mt-1">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email input */}
            <motion.div whileFocus={{ scale: 1.02 }} className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder=" "
                className="peer w-full bg-transparent border-b-2 border-gray-600 pl-10 pr-3 pt-3 pb-2 text-white focus:border-blue-500 focus:outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <label className="absolute left-10 top-1 text-gray-400 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all">
                Email
              </label>
            </motion.div>

            {/* Password input */}
            <motion.div whileFocus={{ scale: 1.02 }} className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="password"
                placeholder=" "
                className="peer w-full bg-transparent border-b-2 border-gray-600 pl-10 pr-3 pt-3 pb-2 text-white focus:border-purple-500 focus:outline-none"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <label className="absolute left-10 top-1 text-gray-400 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all">
                Password
              </label>
            </motion.div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox text-blue-500 rounded"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="hover:text-blue-400">
                Forgot password?
              </Link>
            </div>

            {/* Login button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition shadow-lg shadow-blue-500/30 text-white font-semibold"
            >
              Login
            </motion.button>
          </form>

          {/* Social logins */}
          <div className="mt-6">
            <p className="text-gray-500 text-sm text-center mb-4">Or sign in with</p>
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-white rounded-full shadow-lg"
              >
                <FcGoogle size={22} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-blue-600 text-white rounded-full shadow-lg"
              >
                <FaFacebookF size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-gray-800 text-white rounded-full shadow-lg"
              >
                <FaGithub size={20} />
              </motion.button>
            </div>
          </div>

          {/* Footer */}
          <p className="text-gray-400 text-sm text-center mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:underline">
              Register
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
