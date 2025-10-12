import { motion } from "framer-motion";

const tiles = [
  {
    title: "Urban Essentials",
    subtitle: "City-ready fits",
    img: "/images/urban.jpg",
    href: "/collections/urban"
  },
  {
    title: "Work • Flow",
    subtitle: "Elevated officewear",
    img: "/images/work.jpg",
    href: "/collections/work"
  },
  {
    title: "Tech & Audio",
    subtitle: "Sound • Speed • Style",
    img: "/images/tech.jpg",
    href: "/collections/tech"
  },
];

export default function FeaturedCollections() {
  return (
    <section id="featured" className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent md:text-4xl">Featured Collections</h2>
          <p className="mt-2 text-zinc-400">Handpicked stories crafted by our editors.</p>
        </div>
        <a href="/collections" className="text-sm text-zinc-300 underline-offset-4 hover:underline">View all</a>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {tiles.map((t, i) => (
          <motion.a
            key={i}
            href={t.href}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 120, damping: 16, delay: i * 0.08 }}
            className="group relative overflow-hidden rounded-3xl"
          >
            <img src={t.img} alt={t.title} className="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="text-xl font-semibold text-white">{t.title}</h3>
              <p className="text-sm text-zinc-300">{t.subtitle}</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white backdrop-blur transition group-hover:bg-white/20">
                Shop collection <span>→</span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
