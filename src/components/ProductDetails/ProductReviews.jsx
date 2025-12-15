// src/components/ProductDetails/ProductReviews.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, X } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchReviewsFS, addReviewFS } from "../../firebase/services/reviewService";

/**
 * If your ProductDetailsPage dispatches setSelectedProduct(product),
 * this component reads it from Redux. Alternatively you can pass "product" as a prop.
 */
const ProductReviews = ({ product: propProduct }) => {
  const selectedProduct = useSelector((s) => s.product.selectedProduct);
  const product = propProduct || selectedProduct;

  // Local fallback reviews (keeps UI intact if Firestore unavailable)
  const [reviews, setReviews] = useState([
    // optional seed example removed to avoid duplicates; keep empty by default
  ]);

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", review: "", rating: 0 });

  useEffect(() => {
    if (!product) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await fetchReviewsFS(product.id);
        if (!cancelled) {
          if (Array.isArray(list) && list.length > 0) {
            // Map Firestore timestamp to readable string if present
            const mapped = list.map((r) => ({
              ...r,
              date: r.createdAt && r.createdAt.toDate ? r.createdAt.toDate().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            }));
            setReviews(mapped);
          } else {
            // keep empty array (or pre-seeded local reviews if you prefer)
            setReviews([]);
          }
        }
      } catch (err) {
        console.warn("Could not load reviews from Firestore, using local cache.", err);
        // If Firestore fails, keep any existing local reviews (no-op)
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [product]);

  const handleRating = (ratingValue) => {
    setNewReview((prev) => ({ ...prev, rating: ratingValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) {
      toast.error("No product selected.");
      return;
    }
    if (!newReview.name || !newReview.review || newReview.rating === 0) {
      toast.error("Please fill all fields and select a rating.");
      return;
    }

    const payload = {
      name: newReview.name,
      review: newReview.review,
      rating: Number(newReview.rating),
    };

    // Optimistic UI: add to list immediately with a temporary id + date
    const temp = {
      id: `temp-${Date.now()}`,
      ...payload,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    };
    setReviews((prev) => [temp, ...prev]);
    setNewReview({ name: "", review: "", rating: 0 });
    setShowForm(false);

    // Try to persist to Firestore (if available)
    try {
      const docId = await addReviewFS(product.id, payload);
      // update temp entry id to real id (best-effort)
      setReviews((prev) => prev.map((r) => (r.id === temp.id ? { ...r, id: docId } : r)));
      toast.success("Review submitted — thanks!");
    } catch (err) {
      console.error("Failed to save review:", err);
      toast.error("Failed to save review. It is shown locally for now.");
      // leave optimistic review in UI
    }
  };

  if (!product) {
    return (
      <div className="text-center py-12 text-gray-300">
        No product selected — reviews will appear here.
      </div>
    );
  }

  return (
    <section className="bg-gray-900 text-white py-16 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Customer Reviews
        </motion.h2>

        {/* Loading state */}
        {loading && <div className="text-center text-gray-400 mb-6">Loading reviews...</div>}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(reviews && reviews.length > 0) ? (
            reviews.map((review, index) => (
              <motion.div
                key={review.id}
                className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                whileHover={{ scale: 1.03 }}
              >
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
                <p className="text-gray-300 italic mb-4">“{review.review}”</p>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span className="font-semibold text-gray-200">{review.name}</span>
                  <span>{review.date}</span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 italic py-8">
              No reviews yet — be the first to review this product!
            </div>
          )}
        </div>

        <motion.div className="text-center mt-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }}>
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
          <motion.div className="bg-gray-800 p-8 rounded-2xl w-96 relative" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={() => setShowForm(false)}>
              <X size={20} />
            </button>

            <h3 className="text-2xl font-bold mb-4 text-center">Write a Review</h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="bg-gray-700 p-2 rounded-md text-white outline-none"
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
              />

              <textarea
                name="review"
                placeholder="Your Review"
                className="bg-gray-700 p-2 rounded-md text-white outline-none resize-none h-24"
                value={newReview.review}
                onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
              />

              <div className="flex justify-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={28}
                    className={`cursor-pointer ${i < newReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
                    onClick={() => handleRating(i + 1)}
                  />
                ))}
              </div>

              <button type="submit" className="mt-2 bg-gradient-to-r from-pink-500 to-red-500 py-2 rounded-md font-semibold hover:shadow-pink-500/40 transition-all">
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
