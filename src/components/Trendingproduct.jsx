import { motion } from "framer-motion";

const products = [
  { id: 1, name: "Aero Runner", price: 129, img: "/images/sneaker2.jpg" },
  { id: 2, name: "Nord Backpack", price: 89, img: "/images/bag.jpg" },
  { id: 3, name: "Quartz Watch", price: 199, img: "/images/watch.jpg" },
  { id: 4, name: "Arc Sunglasses", price: 79, img: "/images/sunglasses.jpg" },
  { id: 5, name: "Studio Headset", price: 159, img: "/images/headphones.jpg" },
];

export default function TrendingProducts() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent md:text-4xl">Trending Now</h2>
          <p className="mt-2 text-zinc-400">What shoppers are loving this week.</p>
        </div>
        <a href="/products" className="text-sm text-zinc-300 underline-offset-4 hover:underline">Browse all</a>
      </div>

      <div className="relative">
        {/* subtle gradient edges */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-zinc-900 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-zinc-900 to-transparent" />

        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: "spring", stiffness: 130, damping: 16, delay: i * 0.06 }}
              className="snap-start min-w-[260px] rounded-2xl border border-white/10 bg-zinc-900 p-4"
            >
              <div className="aspect-square overflow-hidden rounded-xl bg-zinc-800">
                <img src={p.img} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white/90">{p.name}</h4>
                  <p className="text-xs text-zinc-400">${p.price}</p>
                </div>
                <button className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:shadow">
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
