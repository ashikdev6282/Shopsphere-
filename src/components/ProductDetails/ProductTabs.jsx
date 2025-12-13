// src/components/ProductDetails/ProductTabs.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import ProductQA from "../ProductDetails/productQA";

export default function ProductTabs({ product: propProduct }) {
  const selectedProduct = useSelector((s) => s.product.selectedProduct);
  const product = propProduct || selectedProduct;

  const tabs = [
    "Description",
    product?.specs || product?.material || product?.size ? "Specifications" : null,
    "Shipping",
    "Reviews",
    "Q&A", // ✅ Added Q&A tab
  ].filter(Boolean);

  const [activeTab, setActiveTab] = useState("Description");

  if (!product) {
    return <div className="text-gray-300 py-4">No product selected.</div>;
  }

  /* ============================================================
     SPECIFICATIONS RENDERER
  ============================================================ */
  const renderSpecifications = () => {
    if (product.specs && typeof product.specs === "object") {
      return (
        <div className="space-y-3 text-gray-300">
          {Object.entries(product.specs).map(([key, value]) => (
            <p key={key}>
              <span className="font-semibold text-white capitalize">{key}:</span>{" "}
              {value}
            </p>
          ))}
        </div>
      );
    }

    // Fallback
    const specFields = [
      { label: "Material", value: product.material },
      { label: "Size", value: product.size },
      { label: "Weight", value: product.weight },
      { label: "Dimensions", value: product.dimensions },
    ].filter((item) => item.value);

    if (specFields.length > 0) {
      return (
        <div className="space-y-3 text-gray-300">
          {specFields.map((spec) => (
            <p key={spec.label}>
              <span className="font-semibold text-white">{spec.label}:</span>{" "}
              {spec.value}
            </p>
          ))}
        </div>
      );
    }

    return (
      <p className="text-gray-400 italic">
        No additional specifications available for this product.
      </p>
    );
  };

  /* ============================================================
     TAB CONTENT RENDERER
  ============================================================ */
  const renderContent = () => {
    switch (activeTab) {
      case "Description":
        return (
          <motion.div
            key="desc"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 70 }}
            className="text-gray-300 leading-relaxed"
          >
            <p>{product.desc || "No description available."}</p>
          </motion.div>
        );

      case "Specifications":
        return (
          <motion.div
            key="specs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 70 }}
            className="text-gray-300"
          >
            {renderSpecifications()}
          </motion.div>
        );

      case "Shipping":
        return (
          <motion.div
            key="shipping"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 70 }}
            className="text-gray-300 leading-relaxed"
          >
            <p>
              Free shipping on orders above ₹999.  
              Delivery estimated within{" "}
              <span className="font-semibold text-white">4–7 business days</span>.
              <br />
              Hassle-free returns within 30 days.
            </p>
          </motion.div>
        );

      case "Reviews":
        return (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 70 }}
            className="text-gray-400"
          >
            <p className="italic mb-4">
              Scroll down to read customer reviews or write your own.
            </p>

            <a
              href="#reviews-section"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Go to Reviews ↓
            </a>
          </motion.div>
        );

      /* ------------------------- Q&A TAB ------------------------- */
      case "Q&A":
        return (
          <motion.div
            key="qa"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 80 }}
          >
            <ProductQA product={product} />
          </motion.div>
        );

      default:
        return null;
    }
  };

  /* ============================================================
     TAB UI
  ============================================================ */
  return (
    <div className="mt-10">
      {/* Tabs */}
      <div className="flex space-x-6 border-b border-gray-700 pb-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-lg font-medium transition-colors whitespace-nowrap ${
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
