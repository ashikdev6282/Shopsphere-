// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimationSection';
import { motion } from 'framer-motion';
import HeroImage from '../assets/images/hero.jpg'; // you can keep or remove this if unused now

const Home = () => { 
  return (
    <div className="text-gray-900">
      {/* Hero Section with Sticky Background */}
      <section className="relative min-h-screen bg-fixed bg-center bg-cover" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1611580788488-44706cf98535?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)` }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-opacity-50 z-0"></div>

        <AnimatedSection stagger={0.3}>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center px-6 py-24 min-h-screen">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 60 }}
            >
              <h1 className="text-5xl font-bold leading-snug text-white drop-shadow-lg">
                Move Your Style Forward with <span className="text-red-400">ShopSphere</span>
              </h1>
              <p className="mt-4 text-lg text-gray-200 max-w-lg">
                High-quality products, curated collections, and seamless shopping experience.
              </p>
              <Link
                to="/products"
                className="inline-block mt-6 px-8 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
              >
                Browse Products
              </Link>
            </motion.div>

            <motion.div
              className="flex justify-center md:justify-end mt-12 md:mt-0"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 60 }}
            >
              <img
                src={HeroImage}
                alt="Hero Showcase"
                className="rounded-xl shadow-xl w-full max-w-md"
              />
            </motion.div>
          </div>
        </AnimatedSection>
      </section>

      {/* Other Sections */}
      
    </div>
  );
};

export default Home;
