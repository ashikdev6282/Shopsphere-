import { Link } from "react-router-dom";
import { FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <h4 className="font-semibold text-white">ShopSphere</h4>
          <p className="mt-3 text-sm text-zinc-400">
            Motion-first commerce. Crafted for speed and delight.
          </p>
        </div>

        <div>
          <h5 className="mb-3 text-sm font-semibold text-white">Shop</h5>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li><Link to="/products" className="hover:text-white">All Products</Link></li>
            <li><Link to="/category/men" className="hover:text-white">Men</Link></li>
            <li><Link to="/category/women" className="hover:text-white">Women</Link></li>
            <li><Link to="/category/electronics" className="hover:text-white">Electronics</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="mb-3 text-sm font-semibold text-white">Company</h5>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="mb-3 text-sm font-semibold text-white">Follow</h5>
          <div className="flex gap-3">
            <a aria-label="Twitter" href="#" className="rounded-full border border-white/10 p-2 text-zinc-300 hover:border-white/20 hover:text-white">
              <FaTwitter />
            </a>
            <a aria-label="Instagram" href="#" className="rounded-full border border-white/10 p-2 text-zinc-300 hover:border-white/20 hover:text-white">
              <FaInstagram />
            </a>
            <a aria-label="YouTube" href="#" className="rounded-full border border-white/10 p-2 text-zinc-300 hover:border-white/20 hover:text-white">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} ShopSphere. All rights reserved.
      </div>
    </footer>
  );
}
