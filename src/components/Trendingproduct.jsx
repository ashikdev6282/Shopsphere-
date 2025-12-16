import { motion } from "framer-motion";

const products = [
  { id: 1, name: "Aero Runner", price: 129, img: "https://images.unsplash.com/photo-1559503125-48103276f1b3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGFlcm8lMjBydW5uZXJ8ZW58MHx8MHx8fDA%3D" },
  { id: 2, name: "Nord Backpack", price: 89, img: "https://images.unsplash.com/photo-1671764673184-740ebf2cd637?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bm9yZCUyMGJhY2twYWNrfGVufDB8fDB8fHww" },
  { id: 3, name: "Quartz Watch", price: 199, img: "https://images.unsplash.com/photo-1651321225388-ced79c17d684?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fFF1YXJ0eiUyMHdhdGNofGVufDB8fDB8fHww" },
  { id: 4, name: "Arc Sunglasses", price: 79, img: "https://images.unsplash.com/photo-1646299583323-68a0c364c588?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGFyYyUyMHN1bmdsYXNzZXN8ZW58MHx8MHx8fDA%3D" },
  { id: 5, name: "Studio Headset", price: 159, img: "https://images.unsplash.com/photo-1761120359417-e7b609cef1ca?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRlY2glMjBhbmQlMjBhdWRpb3xlbnwwfHwwfHx8MA%3D%3D" },
  { id: 6, name: "Comet Jacket", price: 149, img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29tZXQlMjBqYWNrZXR8ZW58MHx8MHx8fDA%3D" },
  { id: 7, name: "Nike Sneakers", price: 119, img: "https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNuZWFrZXJzfGVufDB8fDB8fHww" },
  { id: 8, name: "Vertex Earbuds", price: 99, img: "https://images.unsplash.com/photo-1655560378428-7605bda51749?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGVhcmJ1ZHN8ZW58MHx8MHx8fDA%3D" },
  { id: 9, name: "Pulse Fitness Band", price: 59, img: "https://images.unsplash.com/photo-1596236100208-5994c1c4b660?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDY4fHx8ZW58MHx8fHx8" },
  { id: 10, name: "Nimbus Hoodie", price: 69, img: "https://images.unsplash.com/photo-1610582144787-eda2e6f293b4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGhvb2RpZXxlbnwwfHwwfHx8MA%3D%3D" },
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
