import { motion } from "framer-motion";

const reviews = [
  { name: "Aisha K.", text: "Absolutely premium feel. Checkout was smooth and fast!", avatar: "/images/u1.jpg" },
  { name: "Marco R.", text: "The curation is top-tier. My new daily backpack is perfect.", avatar: "/images/u2.jpg" },
  { name: "Lena P.", text: "Animations make the site feel alive. Also, great deals!", avatar: "/images/u3.jpg" },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <h2 className="mb-10 text-3xl font-bold bg-gradient-to-r from-indigo-400 via-pink-600 to-pink-600 bg-clip-text text-transparent md:text-4xl">What People Say</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {reviews.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 120, damping: 16 }}
            className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 backdrop-blur"
          >
            <div className="mb-4 flex items-center gap-3">
              <img src={r.avatar} alt={r.name} className="h-10 w-10 rounded-full object-cover" />
              <div className="text-sm">
                <p className="font-semibold text-white">{r.name}</p>
                <p className="text-xs text-zinc-400">Verified Buyer</p>
              </div>
            </div>
            <p className="text-zinc-300">{r.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
