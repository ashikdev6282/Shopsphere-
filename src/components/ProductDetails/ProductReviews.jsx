import { useState } from "react";
import { motion } from "framer-motion";
import { Star, X } from "lucide-react";

const ProductReviews = () => {
  const [reviews, setReviews] = useState([
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
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    review: "",
    rating: 0,
  });

  // Handle star click
  const handleRating = (ratingValue) => {
    setNewReview((prev) => ({ ...prev, rating: ratingValue }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newReview.name || !newReview.review || newReview.rating === 0) {
      alert("Please fill in all fields and select a rating.");
      return;
    }

    const today = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const newEntry = {
      id: Date.now(),
      name: newReview.name,
      rating: newReview.rating,
      review: newReview.review,
      date: today,
    };

    setReviews((prev) => [newEntry, ...prev]);
    setNewReview({ name: "", review: "", rating: 0 });
    setShowForm(false);
  };

  return (
    <section className="bg-gray-900 text-white py-16 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Customer Reviews
        </motion.h2>

        {/* Review Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex items-center mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-300 italic mb-4">“{review.review}”</p>
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span className="font-semibold text-gray-200">
                  {review.name}
                </span>
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
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-red-500 font-semibold shadow-lg hover:shadow-pink-500/50 transition-all"
          >
            Write a Review
          </button>
        </motion.div>
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <motion.div
            className="bg-gray-800 p-8 rounded-2xl w-96 relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setShowForm(false)}
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-bold mb-4 text-center">
              Write a Review
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="bg-gray-700 p-2 rounded-md text-white outline-none"
                value={newReview.name}
                onChange={(e) =>
                  setNewReview({ ...newReview, name: e.target.value })
                }
              />

              <textarea
                name="review"
                placeholder="Your Review"
                className="bg-gray-700 p-2 rounded-md text-white outline-none resize-none h-24"
                value={newReview.review}
                onChange={(e) =>
                  setNewReview({ ...newReview, review: e.target.value })
                }
              />

              {/* Rating Selector */}
              <div className="flex justify-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={28}
                    className={`cursor-pointer ${
                      i < newReview.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-500"
                    }`}
                    onClick={() => handleRating(i + 1)}
                  />
                ))}
              </div>

              <button
                type="submit"
                className="mt-2 bg-gradient-to-r from-pink-500 to-red-500 py-2 rounded-md font-semibold hover:shadow-pink-500/40 transition-all"
              >
                Submit Review
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default ProductReviews;
