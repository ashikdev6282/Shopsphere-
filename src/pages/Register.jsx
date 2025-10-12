import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register, setUserData, sendOtp, verifyOtp } from "../redux/authSlice";
import { User, Mail, Lock, Phone, ShieldCheck, Eye, EyeOff, } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaGithub } from "react-icons/fa";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ---------------------------
  //  Validation Function
  // ---------------------------
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.length < 3)
      newErrors.name = "Full name must be at least 3 characters.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email))
      newErrors.email = "Enter a valid email address.";

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit phone number.";

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!passwordRegex.test(formData.password))
      newErrors.password =
        "Password must be at least 6 characters and include a number, a letter, and a symbol.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------------------
  //  Step 1: Send OTP
  // ---------------------------
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(generatedOtp);
    dispatch(setUserData(formData)); // store in Redux
    console.log("OTP Sent (for testing):", generatedOtp);
    setStep(2);
  };

  // ---------------------------
  //  Step 2: Verify OTP
  // ---------------------------
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === sentOtp) {
      dispatch(register(formData));
      alert("✅ OTP Verified! Account Created Successfully.");
      navigate("/");
    } else {
      alert("❌ Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left section */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full md:w-1/2 bg-gradient-to-br from-green-700 via-emerald-800 to-teal-900 flex flex-col items-center justify-center p-8 text-white"
      >
        <div className="text-center max-w-md space-y-6">
          <h1 className="text-4xl font-bold">
            {step === 1 ? "Join Us Today!" : "Verify Your Account"}
          </h1>
          <p className="text-lg opacity-90">
            {step === 1
              ? "Create your account and start your journey with us in just a few clicks."
              : "We’ve sent an OTP to your registered phone number. Please verify to complete signup."}
          </p>
          <motion.img
            src={
              step === 1
                ? "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2070&q=80"
                : "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=2070&q=80"
            }
            alt="Register Illustration"
            className="w-72 mx-auto mt-6 drop-shadow-2xl rounded-full border-4 border-white/20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 80 }}
          />
        </div>
      </motion.div>

      {/* Right section */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-b from-zinc-900 via-black to-zinc-950 p-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8"
        >
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-extrabold text-white">
                    Create Account
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Fill in your details to get started
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSendOtp} className="space-y-6">
                  {/* Name */}
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder=" "
                      className={`peer w-full bg-transparent border-b-2 ${
                        errors.name ? "border-red-500" : "border-gray-600"
                      } pl-10 pr-3 pt-3 pb-2 text-white focus:border-green-500 focus:outline-none`}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                    <label className="absolute left-10 top-2 text-gray-400 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base transition-all">
                      Full Name
                    </label>
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      placeholder=" "
                      className={`peer w-full bg-transparent border-b-2 ${
                        errors.email ? "border-red-500" : "border-gray-600"
                      } pl-10 pr-3 pt-3 pb-2 text-white focus:border-green-500 focus:outline-none`}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                    <label className="absolute left-10 top-2 text-gray-400 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base transition-all">
                      Email
                    </label>
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      placeholder=" "
                      className={`peer w-full bg-transparent border-b-2 ${
                        errors.phone ? "border-red-500" : "border-gray-600"
                      } pl-10 pr-3 pt-3 pb-2 text-white focus:border-green-500 focus:outline-none`}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                    <label className="absolute left-10 top-2 text-gray-400 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base transition-all">
                      Phone Number
                    </label>
                    {errors.phone && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder=" "
                      className={`peer w-full bg-transparent border-b-2 ${
                        errors.password ? "border-red-500" : "border-gray-600"
                      } pl-10 pr-10 pt-3 pb-2 text-white focus:border-green-500 focus:outline-none`}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                    <label className="absolute left-10 top-2 text-gray-400 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base transition-all">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {errors.password && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition shadow-lg shadow-green-500/30 text-white font-semibold"
                  >
                    Send OTP
                  </motion.button>
                </form>

                {/* Footer */}
                <p className="text-gray-400 text-sm text-center mt-6">
                  Already have an account?{" "}
                  <Link to="/login" className="text-green-400 hover:underline">
                    Login
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-extrabold text-white">
                    Verify OTP
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Enter the 6-digit code sent to your phone number
                  </p>
                </div>

                {/* OTP Form */}
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      maxLength="6"
                      placeholder="Enter OTP"
                      className="peer w-full bg-transparent border-b-2 border-gray-600 pl-10 pr-3 pt-3 pb-2 text-white text-center focus:border-green-500 focus:outline-none tracking-widest text-xl"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition shadow-lg shadow-green-500/30 text-white font-semibold"
                  >
                    Verify OTP
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full py-2 text-gray-400 text-sm hover:text-green-400 transition"
                  >
                    ← Go Back
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
