// src/components/ProductReviews.jsx
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "John Doe",
    rating: 5,
    review:
      "Absolutely loved the product! Quality exceeded my expectations and delivery was super fast.",
    date: "March 15, 2025",
  },
  {
    id: 2,
    name: "Sarah Lee",
    rating: 4,
    review:
      "Great value for money. The packaging was premium and the product works perfectly.",
    date: "March 10, 2025",
  },
  {
    id: 3,
    name: "Michael Brown",
    rating: 5,
    review:
      "One of the best purchases I’ve made recently. Highly recommend it to everyone.",
    date: "March 8, 2025",
  },
];

const ProductReviews = () => {
  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Heading */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Customer Reviews
        </motion.h2>

        {/* Reviews List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.03 }}
            >
              {/* Rating */}
              <div className="flex items-center mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-300 italic mb-4">“{review.review}”</p>

              {/* Reviewer Info */}
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span className="font-semibold text-gray-200">{review.name}</span>
                <span>{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <button className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-red-500 font-semibold shadow-lg hover:shadow-pink-500/50 transition-all">
            Write a Review
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductReviews;
