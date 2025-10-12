import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 }
  }
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 16 } }
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-zinc-950 via-black to-zinc-900 text-white">
      {/* background accents */}
      <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex min-h-[88vh] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center"
      >
        <motion.span variants={item} className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-zinc-300 backdrop-blur">
          ✨ New Season • Free shipping over $99
        </motion.span>
        <motion.h1 variants={item} className="text-5xl font-extrabold tracking-tight md:text-7xl">
          Welcome to <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">ShopSphere</span>
        </motion.h1>
        <motion.p variants={item} className="mt-6 max-w-2xl text-lg text-zinc-300">
          Discover curated collections, limited drops, and best-in-class design. Built with motion, made for delight.
        </motion.p>
        <motion.div variants={item} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <motion.a
            href="/products"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-2xl bg-gradient-to-r from-indigo-400 to-pink-500 px-6 py-3 font-semibold text-white-900 shadow-lg shadow-white/10"
          >
            Shop Now
          </motion.a>
          <motion.a
            href="#featured"
            whileHover={{ x: 4 }}
            className="group inline-flex items-center gap-2 rounded-2xl border border-white/15 px-6 py-3 text-white/90"
          >
            Explore Collections
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </motion.a>
        </motion.div>

        {/* floating product cards */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 80, damping: 18 }}
          className="pointer-events-none mt-16 grid w-full max-w-5xl grid-cols-2 gap-4 px-4 sm:grid-cols-3"
        >
          {[
            { title: "Statement Sneakers", img: "/images/sneaker.jpg" },
            { title: "Minimal Smartwatch", img: "/images/watch.jpg" },
            { title: "Studio Headphones", img: "/images/headphones.jpg" },
          ].map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6, rotate: 0.5 }}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-3 backdrop-blur"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-zinc-800">
                <img src={p.img} alt={p.title} className="h-full w-full object-cover" />
              </div>
              <p className="mt-3 text-sm text-zinc-200">{p.title}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
