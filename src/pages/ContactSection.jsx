import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";


export default function Contact() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Background Decorative Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Header */}
      <section className="relative z-10 text-center py-20 px-6">
        <motion.h1
          className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Get in Touch
        </motion.h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          We'd love to hear from you! Whether you have a question, feedback, or
          just want to say hello, feel free to reach out.
        </p>
      </section>

      {/* Contact Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

          <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl shadow-lg backdrop-blur-md hover:bg-white/10 transition">
            <Mail className="text-pink-400 w-8 h-8" />
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-gray-300">support@yourbrand.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl shadow-lg backdrop-blur-md hover:bg-white/10 transition">
            <Phone className="text-purple-400 w-8 h-8" />
            <div>
              <p className="font-semibold">Phone</p>
              <p className="text-gray-300">+91 98765 43210</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl shadow-lg backdrop-blur-md hover:bg-white/10 transition">
            <MapPin className="text-blue-400 w-8 h-8" />
            <div>
              <p className="font-semibold">Address</p>
              <p className="text-gray-300">123 Main Street, Kochi, India</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-lg space-y-6"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

          {/* Floating Label Inputs */}
          <div className="relative">
            <input
              type="text"
              id="name"
              className="peer w-full rounded-xl bg-transparent border border-gray-600 px-4 pt-5 pb-2 text-white placeholder-transparent focus:border-pink-400 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
              placeholder="Your Name"
              required
            />
            <label
              htmlFor="name"
              className="absolute left-4 top-2.5 text-gray-400 text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base transition-all peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-pink-400"
            >
              Your Name
            </label>
          </div>

          <div className="relative">
            <input
              type="email"
              id="email"
              className="peer w-full rounded-xl bg-transparent border border-gray-600 px-4 pt-5 pb-2 text-white placeholder-transparent focus:border-pink-400 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
              placeholder="Your Email"
              required
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-2.5 text-gray-400 text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base transition-all peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-pink-400"
            >
              Your Email
            </label>
          </div>

          <div className="relative">
            <textarea
              id="message"
              rows="4"
              className="peer w-full rounded-xl bg-transparent border border-gray-600 px-4 pt-5 pb-2 text-white placeholder-transparent focus:border-pink-400 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
              placeholder="Your Message"
              required
            ></textarea>
            <label
              htmlFor="message"
              className="absolute left-4 top-2.5 text-gray-400 text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base transition-all peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-pink-400"
            >
              Your Message
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg"
          >
            Send Message
          </button>
        </motion.form>
      </section>
      
    </div>
  );
}
