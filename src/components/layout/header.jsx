// src/components/layout/Header.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, User, Search } from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-zinc-600 via-black to-zinc-800 text-white backdrop-blur-md shadow-md"
          : "bg-gradient-to-r from-zinc-600 via-black to-zinc-800 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold tracking-tight bg-gradient-to-r from-zinc-600 via-pink to-pink-500 bg-clip-text text-transparent"
        >
          ShopSphere
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 font-medium text-lg">
          <Link to="/homepage" className="relative group">
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all"></span>
          </Link>
          <Link to="/products" className="relative group">
            Products
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all"></span>
          </Link>
          <Link to="/about" className="relative group">
            About
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all"></span>
          </Link>
          <Link to="/contact" className="relative group">
            Contact
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all"></span>
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center space-x-5">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-1.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-500"
            />
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart size={24} className="hover:text-red-500 transition" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
              2
            </span>
          </Link>

          {/* User */}
          <Link to="/profile">
            <User size={24} className="hover:text-red-500 transition" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden px-4 pb-4 space-y-3 text-gray-700 font-medium bg-white shadow">
          <Link to="/homepage" className="block hover:text-red-500">
            Home
          </Link>
          <Link to="/products" className="block hover:text-red-500">
            Products
          </Link>
          <Link to="/about" className="block hover:text-red-500">
            About
          </Link>
          <Link to="/contact" className="block hover:text-red-500">
            Contact
          </Link>
          <div className="flex space-x-6 pt-3 border-t">
            <Link to="/cart">
              <ShoppingCart size={22} />
            </Link>
            <Link to="/profile">
              <User size={22} />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
