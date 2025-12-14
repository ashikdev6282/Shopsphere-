// src/pages/OrderDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById, updateOrderStatusById, } from "../firebase/services/orderService";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = async () => {
    try {
      const data = await getOrderById(orderId);
      if (!data) {
        toast.error("Order not found.");
        return;
      }
      setOrder(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, []);

  const statusSteps = ["Pending", "Processing", "Shipped", "Completed"];
  const currentStep = statusSteps.indexOf(order?.status);

  const cancelOrder = async () => {
    if (!["Pending", "Processing"].includes(order.status)) {
      toast.error("Order cannot be cancelled anymore.");
      return;
    }

    const confirm = window.confirm("Do you really want to cancel this order?");
    if (!confirm) return;

    try {
      await updateOrderStatusById(orderId, { status: "Cancelled" });
      toast.success("Order Cancelled Successfully.");
      loadOrder();
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order.");
    }
  };

  if (loading)
    return <p className="text-center text-gray-400 mt-20">Loading order...</p>;

  if (!order)
    return (
      <p className="text-center text-gray-400 mt-20">
        Order does not exist.
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-400">Order Details</h1>
            <p className="text-sm text-gray-400 mt-1">
              Order ID: <span className="text-gray-200">{orderId}</span>
            </p>
            <p className="text-sm text-gray-400">
              Date:{" "}
              {order.createdAt?.toDate
                ? order.createdAt.toDate().toLocaleString()
                : order.createdAt}
            </p>
          </div>

          {/* STATUS BADGE */}
          <span
            className={`px-4 py-1 rounded-full border font-medium ${
              order.status === "Pending"
                ? "bg-yellow-500/20 border-yellow-500 text-yellow-300"
                : order.status === "Processing"
                ? "bg-blue-500/20 border-blue-500 text-blue-300"
                : order.status === "Shipped"
                ? "bg-purple-500/20 border-purple-500 text-purple-300"
                : order.status === "Completed"
                ? "bg-green-500/20 border-green-500 text-green-300"
                : "bg-red-500/20 border-red-500 text-red-300"
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* TRACKING PROGRESS */}
        <div className="my-8">
          <h2 className="text-lg font-semibold mb-4">Order Progress</h2>
          <div className="flex items-center justify-between relative">
            {statusSteps.map((step, i) => (
              <div key={i} className="relative flex-1 flex flex-col items-center">
                {/* LINE */}
                {i !== 0 && (
                  <div
                    className={`absolute -left-1/2 top-4 h-1 w-full ${
                      i <= currentStep ? "bg-green-500" : "bg-gray-700"
                    }`}
                  ></div>
                )}

                {/* DOT */}
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                    i <= currentStep
                      ? "bg-green-500 border-green-400"
                      : "border-gray-600 bg-gray-700"
                  }`}
                >
                  {i <= currentStep ? "✓" : ""}
                </div>

                {/* LABEL */}
                <p className="text-sm mt-2">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ORDER ITEMS */}
        <div className="">
          <h2 className="text-lg font-semibold mb-3">Items</h2>
          <div className="bg-gray-700/20 rounded-lg p-4 space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between text-sm text-gray-300"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Payment Summary</h2>
          <div className="space-y-2 text-gray-300 text-sm">
            <p>
              <span className="text-gray-400">Subtotal:</span> ₹
              {order.totalAmount - 10}
            </p>
            <p>
              <span className="text-gray-400">Shipping:</span> ₹10
            </p>
            <p className="font-semibold text-white">
              Total Paid: ₹{order.totalAmount}
            </p>
            <p>
              <span className="text-gray-400">Method:</span>{" "}
              {order.paymentMethod.toUpperCase()}
            </p>
            <p>
              <span className="text-gray-400">Payment Status:</span>{" "}
              {order.paymentStatus}
            </p>
          </div>
        </div>

        {/* SHIPPING DETAILS */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Shipping Details</h2>
          <div className="text-gray-300 text-sm space-y-1">
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city} - {order.shippingAddress.zip}
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 mt-8">
          {/* CANCEL BUTTON (Conditional) */}
          {["Pending", "Processing"].includes(order.status) && (
            <button
              onClick={cancelOrder}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-medium transition"
            >
              Cancel Order
            </button>
          )}

          {/* REORDER */}
          <button
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition"
            onClick={() => toast("Reorder functionality coming soon!")}
          >
            Reorder
          </button>
        </div>
      </motion.div>
    </div>
  );
}
