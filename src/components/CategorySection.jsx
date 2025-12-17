import { motion } from "framer-motion";

const cats = [
  { label: "Men", img: "https://plus.unsplash.com/premium_photo-1687989650785-7edeaaddc7a7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fG1lbnMlMjBmYXNoaW9ufGVufDB8fDB8fHww", href: "/products" },
  { label: "Women", img: "https://plus.unsplash.com/premium_photo-1689575249162-beed0ac1f015?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fHdvbWVuJTIwZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D", href: "/products" },
  { label: "Accessories", img: "https://images.unsplash.com/3/www.madebyvadim.com.jpg?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWNjZXNzb3JpZXN8ZW58MHx8MHx8fDA%3D", href: "/products" },
  { label: "Electronics", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWxlY3Ryb25pY3N8ZW58MHx8MHx8fDA%3D", href: "/products" },
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
