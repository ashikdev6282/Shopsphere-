// src/components/ProductDetails/ProductTabs.jsx
import { useState } from "react";
import { motion } from "framer-motion";

const tabs = ["Description", "Reviews", "Shipping"];

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("Description");

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
            <p>
              This is a premium product crafted with top-quality materials. It is 
              designed for durability, comfort, and unmatched performance. Ideal for 
              everyday use, gifting, and enhancing your lifestyle.
            </p>
          </motion.div>
        );
      case "Reviews":
        return (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 70 }}
            className="space-y-4"
          >
            <div className="bg-gray-800 p-4 rounded-xl">
              <p className="text-gray-200 font-medium">⭐️⭐️⭐️⭐️⭐️</p>
              <p className="text-gray-400 text-sm mt-1">
                Amazing quality! Totally worth the purchase.
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl">
              <p className="text-gray-200 font-medium">⭐️⭐️⭐️⭐️</p>
              <p className="text-gray-400 text-sm mt-1">
                Very good product, delivery was fast too.
              </p>
            </div>
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
              Free worldwide shipping on orders above $100.  
              Delivery within <span className="font-semibold text-white">5-7 business days</span>.  
              Easy returns within 30 days.
            </p>
          </motion.div>
        );
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
            className={`pb-2 text-lg font-medium transition-colors ${
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
};

export default ProductTabs;
