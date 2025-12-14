// src/pages/MyOrders.jsx
import React, { useEffect, useState } from "react";
import {
  fetchUserOrders,
  updateOrderStatusById,
} from "../firebase/services/orderService";
import { auth } from "../firebase/firebase_config";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("You must be logged in to view orders.");
        return;
      }

      const data = await fetchUserOrders(user.uid);
      setOrders(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  const badgeColors = {
    Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500",
    Processing: "bg-blue-500/20 text-blue-400 border-blue-500",
    Shipped: "bg-purple-500/20 text-purple-400 border-purple-500",
    Completed: "bg-green-500/20 text-green-400 border-green-500",
    Cancelled: "bg-red-500/20 text-red-400 border-red-500",
  };

  // Mini Progress Bar Component
  const MiniProgress = ({ status }) => {
    const steps = ["Pending", "Processing", "Shipped", "Completed"];
    const currentIndex = steps.indexOf(status);

    return (
      <div className="flex mt-4 gap-2 items-center">
        {steps.map((step, i) => (
          <div
            key={step}
            className={`flex-1 h-2 rounded-full transition ${
              i <= currentIndex ? "bg-green-500" : "bg-gray-700"
            }`}
          ></div>
        ))}
      </div>
    );
  };

  // Cancel Order
  const handleCancel = async (orderId, currentStatus) => {
    if (!["Pending", "Processing"].includes(currentStatus)) {
      toast.error("This order cannot be cancelled.");
      return;
    }

    const confirm = window.confirm("Are you sure you want to cancel this order?");
    if (!confirm) return;

    try {
      await updateOrderStatusById(orderId, { status: "Cancelled" });

      toast.success("Order cancelled successfully.");
      loadOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-400">
        My Orders
      </h1>

      {/* Filters */}
      <div className="flex justify-center mb-8">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-gray-200"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>

      {/* Loading */}
      {loading && <p className="text-center text-gray-400">Loading orders...</p>}

      {/* Empty */}
      {!loading && filteredOrders.length === 0 && (
        <p className="text-center text-gray-400 mt-20 text-lg italic">
          You haven’t placed any orders yet.
        </p>
      )}

      {/* ORDER LIST */}
      <div className="space-y-6 max-w-3xl mx-auto">
        {filteredOrders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Order ID</p>
                <p className="font-semibold">{order.id}</p>
              </div>

              <span
                className={`px-3 py-1 border rounded-full text-sm font-medium ${
                  badgeColors[order.status]
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* META INFO */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-300 text-sm">
              <p>
                <span className="text-gray-400">Total:</span> ₹{order.totalAmount}
              </p>
              <p>
                <span className="text-gray-400">Payment:</span>{" "}
                {order.paymentMethod.toUpperCase()}
              </p>
              <p>
                <span className="text-gray-400">Status:</span>{" "}
                {order.paymentStatus}
              </p>
              <p className="col-span-2 sm:col-span-1">
                <span className="text-gray-400">Date:</span>{" "}
                {order.createdAt?.toDate
                  ? order.createdAt.toDate().toLocaleString()
                  : order.createdAt}
              </p>
            </div>

            {/* MINI PROGRESS */}
            <MiniProgress status={order.status} />

            {/* EXPAND BUTTON */}
            <button
              onClick={() =>
                setExpanded(expanded === order.id ? null : order.id)
              }
              className="mt-4 w-full flex items-center justify-between bg-gray-700/40 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
            >
              <span className="text-sm">View Items</span>
              {expanded === order.id ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>

            {/* ITEMS */}
            <AnimatePresence>
              {expanded === order.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 bg-gray-700/30 p-4 rounded-lg space-y-3"
                >
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-sm text-gray-300"
                    >
                      <p>
                        {item.name} × {item.quantity}
                      </p>
                      <p>₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-4">
              {/* View Details */}
              <button
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-medium"
                onClick={() => (window.location.href = `/order/${order.id}`)}
              >
                View Details
              </button>

              {/* Cancel Order (conditional) */}
              {["Pending", "Processing"].includes(order.status) && (
                <button
                  onClick={() => handleCancel(order.id, order.status)}
                  className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition font-medium"
                >
                  Cancel Order
                </button>
              )}
            </div>

            {/* Track Order */}
            <button
              onClick={() => (window.location.href = `/order/${order.id}`)}
              className="mt-3 w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-medium"
            >
              Track Order
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
