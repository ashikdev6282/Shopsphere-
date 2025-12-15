// src/components/ProductDetails/ProductTabs.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import ProductQA from "./productQA";
import { deleteReviewFS } from "../../firebase/services/reviewService";
import { removeReview } from "../../redux/reviewSlice";
import ProductReviews from "./ProductReviews";

export default function ProductTabs({ product: propProduct }) {
  const dispatch = useDispatch();

  const selectedProduct = useSelector((s) => s.product.selectedProduct);
  const product = propProduct || selectedProduct;

  const { user } = useSelector((s) => s.auth);
  const { items: reviews, loading } = useSelector(
    (s) => s.reviews || { items: [], loading: false }
  );

  const tabs = ["Description", "Shipping", "Reviews", "Q&A"];
  const [activeTab, setActiveTab] = useState("Description");

  if (!product) {
    return <div className="text-gray-300 py-4">No product selected.</div>;
  } 

  /* ================= REVIEWS UI ================= */
  const renderReviews = () => {
    if (loading) {
      return <p className="text-gray-400">Loading reviews...</p>;
    }

    if (reviews.length === 0) {
      return <p className="text-gray-400">No reviews yet</p>;
    }

    return reviews.map((r) => (
      <div key={r.id} className="border-b border-gray-700 py-4">
        <div className="flex justify-between items-center">
          <strong>{r.userName}</strong>

          {r.uid === user?.uid && (
            <Trash2
              size={16}
              className="text-red-400 cursor-pointer"
              onClick={async () => {
                await deleteReviewFS(product.id, r.id);
                dispatch(removeReview(r.id));
                toast.success("Review deleted");
              }}
            />
          )}
        </div>

        <div className="flex gap-1 my-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              size={14}
              className={
                n <= r.rating ? "text-yellow-400" : "text-gray-600"
              }
            />
          ))}
        </div>

        <p className="text-gray-300">{r.comment}</p>
      </div>
    ));
  };

  /* ================= TAB CONTENT ================= */
  const renderContent = () => {
    switch (activeTab) {
      case "Description":
        return (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-300"
          >
            {product.desc || "No description available."}
          </motion.p>
        );

      case "Shipping":
        return (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-300"
          >
            Free shipping within 4–7 business days. Easy returns available.
          </motion.p>
        );

      case "Reviews":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <ProductReviews product={product} />
          </motion.div>
        );

      case "Q&A":
        return <ProductQA product={product} />;

      default:
        return null;
    }
  };

  return (
    <div className="mt-10">
      {/* Tabs */}
      <div className="flex space-x-6 border-b border-gray-700 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-lg ${
              activeTab === tab
                ? "text-white border-b-2 border-red-500"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">{renderContent()}</div>
    </div>
  );
}
