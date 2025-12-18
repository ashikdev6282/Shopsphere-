import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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

  /* ================= CART FROM REDUX ================= */
  const cartItems = useSelector((state) => state.cart.items || []);
  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  /* ================= SCROLL EFFECT ================= */
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
        {/* ================= LOGO ================= */}
        <Link
          to="/"
          className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent"
        >
          ShopSphere
        </Link>

        {/* ================= DESKTOP NAV ================= */}
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

        {/* ================= DESKTOP ACTIONS ================= */}
        <div className="hidden md:flex items-center space-x-5">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-1.5 rounded-full bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-600" />
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart size={24} className="hover:text-red-500 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile */}
          <Link to="/profile">
            <User size={24} className="hover:text-red-500 transition" />
          </Link>
        </div>

        {/* ================= MOBILE TOGGLE ================= */}
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
            <MobileLink
              to="/products"
              icon={<Package size={18} />}
              label="Products"
            />
            <MobileLink to="/about" icon={<Info size={18} />} label="About" />
            <MobileLink to="/contact" icon={<Phone size={18} />} label="Contact" />
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t border-white/10">
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition"
            >
              <ShoppingCart size={20} />
              Cart
              {cartCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
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

/* ================= MOBILE LINK ================= */
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
