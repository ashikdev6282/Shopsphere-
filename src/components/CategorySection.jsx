import { motion } from "framer-motion";

const cats = [
  { label: "Men", img: "/images/men.jpg", href: "/category/men" },
  { label: "Women", img: "/images/women.jpg", href: "/category/women" },
  { label: "Accessories", img: "/images/accessories.jpg", href: "/category/accessories" },
  { label: "Electronics", img: "/images/tech.jpg", href: "/category/electronics" },
];

export default function CategoriesShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <h2 className="mb-10 text-3xl font-bold bg-gradient-to-r from-indigo-500 via-pink-600 to-pink-600 bg-clip-text text-transparent md:text-4xl">Shop by Category</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cats.map((c, i) => (
          <motion.a
            key={i}
            href={c.href}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 120, damping: 16 }}
            className="group relative overflow-hidden rounded-2xl"
          >
            <img src={c.img} alt={c.label} className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-60" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <span className="absolute bottom-3 left-3 rounded-full bg-white/10 px-3 py-1 text-xs text-white backdrop-blur">
              {c.label}
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
