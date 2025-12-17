import { motion } from "framer-motion";

const reviews = [
  { name: "Aisha K.", text: "Absolutely premium feel. Checkout was smooth and fast!", avatar: "https://plus.unsplash.com/premium_photo-1689564003745-946f35267ffe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D" },
  { name: "Marco R.", text: "The curation is top-tier. My new daily backpack is perfect.", avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D" },
  { name: "Lena P.", text: "Animations make the site feel alive. Also, great deals!", avatar: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D" },
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
