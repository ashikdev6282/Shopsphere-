import { motion } from "framer-motion";

export default function NewsletterCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 py-24">
      <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-pink-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="mx-auto max-w-5xl px-6 text-center">
        <motion.h3
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          className="text-3xl font-bold text-white md:text-4xl"
        >
          Get early access to drops & exclusive deals
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.05, type: "spring", stiffness: 120, damping: 16 }}
          className="mx-auto mt-3 max-w-xl text-zinc-300"
        >
          Join 50,000+ subscribers. One click unsubscribe.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 120, damping: 16 }}
          className="mx-auto mt-8 flex max-w-lg items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/60 p-2 backdrop-blur"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            required
            placeholder="Your email address"
            className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none"
          />
          <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-900">Subscribe</button>
        </motion.form>
      </div>
    </section>
  );
}
