import { motion } from "framer-motion";

const best = [
  { id: 1, name: "Classic Blazer", price: 210, img: "/images/formal-suit.jpg" },
  { id: 2, name: "Floral Midi Skirt", price: 98, img: "/images/floral-skirt.jpg" },
  { id: 3, name: "Red Gown", price: 180, img: "/images/red-gown.jpg" },
  { id: 4, name: "Table Lamp", price: 60, img: "/images/lamp.jpg" },
  { id: 5, name: "Bluetooth Speaker", price: 99, img: "/images/speaker.jpg" },
  { id: 6, name: "Cushion Set", price: 45, img: "/images/cushion.jpg" },
];

export default function BestSellers() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold  md:text-4xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Best Sellers</h2>
          <p className="mt-2 text-zinc-400">Loved by thousands of customers.</p>
        </div>
        <a href="/products?sort=top" className="text-sm text-zinc-300 underline-offset-4 hover:underline">
          View leaderboard
        </a>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
        {best.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 120, damping: 16 }}
            className="rounded-2xl border border-white/10 bg-zinc-900 p-3"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-xl bg-zinc-800">
              <img src={p.img} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <h4 className="text-sm text-white/90">{p.name}</h4>
                <p className="text-xs text-zinc-400">${p.price}</p>
              </div>
              <button className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-zinc-900">Quick Add</button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
