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
            <li><a href="/products" className="hover:text-white">All Products</a></li>
            <li><a href="/category/men" className="hover:text-white">Men</a></li>
            <li><a href="/category/women" className="hover:text-white">Women</a></li>
            <li><a href="/category/electronics" className="hover:text-white">Electronics</a></li>
          </ul>
        </div>
        <div>
          <h5 className="mb-3 text-sm font-semibold text-white">Company</h5>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li><a href="/about" className="hover:text-white">About</a></li>
            <li><a href="/faq" className="hover:text-white">FAQ</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h5 className="mb-3 text-sm font-semibold text-white">Follow</h5>
          <div className="flex gap-3">
            {["twitter", "instagram", "youtube"].map((s) => (
              <a key={s} href="#" className="rounded-full border border-white/10 p-2 text-zinc-300 hover:border-white/20 hover:text-white">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} ShopSphere. All rights reserved.
      </div>
    </footer>
  );
}
