import { motion } from "framer-motion";
import { FaUsers, FaBullseye, FaLightbulb } from "react-icons/fa";

export default function About() {
  const timeline = [
    { year: "2018", title: "Founded", text: "Started with a small passionate team and a big vision." },
    { year: "2019", title: "First Milestone", text: "Launched our first product and gained strong early adopters." },
    { year: "2021", title: "Expansion", text: "Expanded into new markets and doubled our team size." },
    { year: "2023", title: "Innovation", text: "Introduced cutting-edge solutions with global impact." },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 text-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-6"
        >
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">About Us</h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Crafting experiences that inspire and empower. Our journey is driven by passion, innovation, and people.
          </p>
        </motion.div>
        {/* Decorative blurred circles */}
        <div className="absolute w-72 h-72 bg-pink-500/30 rounded-full blur-3xl top-10 left-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl bottom-10 right-10"></div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 relative">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.img
            src="https://plus.unsplash.com/premium_photo-1724220736652-8514fef4f067?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGZhc2hpb24lMjBhbmQlMjBjbG90aGluZ3xlbnwwfHwwfHx8MA%3D%3D"
            alt="About"
            className="rounded-2xl shadow-2xl"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          />
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-300 to-pink-600 bg-clip-text text-transparent">Who We Are</h2>
            <p className="text-lg text-gray-700 mb-4">
              We are a forward-thinking company blending creativity and technology to build impactful products.
              Our mission is to innovate, inspire, and create meaningful change.
            </p>
            <p className="text-lg text-gray-700">
              Every idea starts with a spark. We turn that spark into something extraordinary that empowers communities worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Journey Timeline (Zig-Zag) */}
      <section className="py-20 bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 to-white">
        <div className="max-w-6xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-300 to-pink-600 bg-clip-text text-transparent">Our Journey</h2>
          <p className="text-gray-600 mt-3">The milestones that shaped us into who we are today.</p>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-indigo-500 to-purple-600"></div>
          <div className="space-y-16">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                className={`relative flex items-center ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="w-1/2"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-indigo-600 border-4 border-white rounded-full shadow-lg"></div>
                <div
                  className={`w-1/2 px-6 ${i % 2 === 0 ? "text-left" : "text-right"}`}
                >
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-indigo-700">{item.year} - {item.title}</h3>
                    <p className="text-gray-600 mt-2">{item.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision / Mission / Values */}
      <section className="py-20 bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-bold">Our Core Beliefs</h2>
          <p className="mt-3 text-gray-300">The principles that guide everything we create.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: <FaUsers className="text-pink-400 text-4xl mb-4" />, title: "Community First", text: "We put people at the center of everything we build." },
            { icon: <FaBullseye className="text-yellow-400 text-4xl mb-4" />, title: "Purpose Driven", text: "Our work is fueled by a clear mission and vision." },
            { icon: <FaLightbulb className="text-green-400 text-4xl mb-4" />, title: "Innovation", text: "We embrace creativity and bold ideas to solve real problems." }
          ].map((card, i) => (
            <motion.div
              key={i}
              className="bg-gray-800 rounded-2xl p-8 shadow-lg hover:scale-105 transition-transform"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {card.icon}
              <h3 className="text-2xl font-semibold mb-3">{card.title}</h3>
              <p className="text-gray-300">{card.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
