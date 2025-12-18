// src/components/layout/Header.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Search,
  Home,
  Info,
  Phone,
  Package,
} from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md shadow-lg bg-black/70"
          : "bg-gradient-to-r from-zinc-700 via-black to-zinc-800"
      } text-white`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent"
        >
          ShopSphere
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 font-medium text-lg">
          {["Home", "Products", "About", "Contact"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/homepage" : `/${item.toLowerCase()}`}
              className="relative group"
            >
              {item}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all"></span>
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-1.5 rounded-full bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-600" />
          </div>

          <Link to="/cart" className="relative">
            <ShoppingCart size={24} className="hover:text-red-500 transition" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
              2
            </span>
          </Link>

          <Link to="/profile">
            <User size={24} className="hover:text-red-500 transition" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg bg-white/10 backdrop-blur hover:bg-white/20 transition"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-4 mt-2 mb-4 rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-xl p-5 space-y-5">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          {/* Nav Links */}
          <div className="space-y-3">
            <MobileLink to="/homepage" icon={<Home size={18} />} label="Home" />
            <MobileLink to="/products" icon={<Package size={18} />} label="Products" />
            <MobileLink to="/about" icon={<Info size={18} />} label="About" />
            <MobileLink to="/contact" icon={<Phone size={18} />} label="Contact" />
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t border-white/10">
            <Link
              to="/cart"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition"
            >
              <ShoppingCart size={20} />
              Cart
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition"
            >
              <User size={20} />
              Profile
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

/* ================= SMALL MOBILE LINK COMPONENT ================= */
const MobileLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition"
  >
    <span className="text-red-400">{icon}</span>
    <span className="text-lg font-medium">{label}</span>
  </Link>
);

export default Header;
