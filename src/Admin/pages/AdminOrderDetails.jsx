// src/pages/admin/AdminOrderDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderById,
  updateOrderStatusById,
  deleteOrderById,
} from "../../firebase/services/orderService";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Trash2,
  Package,
  MapPin,
  User,
  CreditCard,
  Calendar,
} from "lucide-react";

export default function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load order.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const updateStatus = async (status) => {
    try {
      setUpdating(true);
      await updateOrderStatusById(id, { status });
      setOrder({ ...order, status });
      toast.success("Status updated ✔");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const deleteOrder = async () =>  
 {
    if (!window.confirm("Delete this order permanently?")) return;
    try {
      await deleteOrderById(id);
      toast.success("Order deleted 🗑");
      navigate("/admin/orders");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete order.");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-300">
        Loading Order Details...
      </div>
    );

  if (!order)
    return <div className="p-10 text-center text-red-400">Order not found.</div>;

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-gray-100">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <button
          onClick={deleteOrder}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl"
        >
          <Trash2 size={18} /> Delete Order
        </button>
      </div>

      {/* ORDER HEADER */}
      <h1 className="text-3xl font-bold text-purple-400 mb-4">
        Order #{order.id}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE — Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* STATUS + PAYMENT */}
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package size={20} /> Order Status
            </h2>

            <select
              value={order.status}
              disabled={updating}
              onChange={(e) => updateStatus(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl text-gray-200"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* PAYMENT INFO */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard size={20} /> Payment Details
              </h2>

              <p className="text-gray-300">
                <span className="text-gray-400">Method:</span>{" "}
                {order.paymentMethod?.toUpperCase()}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-400">Status:</span>{" "}
                {order.paymentStatus}
              </p>
              {order.paymentId && (
                <p className="text-gray-300">
                  <span className="text-gray-400">Payment ID:</span>{" "}
                  {order.paymentId}
                </p>
              )}
            </div>
          </div>

          {/* ITEMS */}
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package size={20} /> Items
            </h2>

            <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-gray-900 p-4 rounded-xl border border-gray-700"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-400 text-sm">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-green-400 font-bold">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <hr className="border-gray-700 my-4" />

            <div className="flex justify-between text-lg font-semibold text-white">
              <p>Total:</p>
              <p>₹{order.totalAmount}</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — Customer + Shipping */}
        <div className="space-y-6">
          {/* CUSTOMER */}
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User size={20} /> Customer
            </h2>

            <p className="text-gray-300">
              <span className="text-gray-400">Name:</span>{" "}
              {order.customerName || "N/A"}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Email:</span>{" "}
              {order.customerEmail || "N/A"}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Phone:</span>{" "}
              {order.customerPhone || "N/A"}
            </p>

            <p className="mt-4 text-gray-300 flex items-center gap-2">
              <Calendar size={18} />
              {order.createdAt?.toDate
                ? order.createdAt.toDate().toLocaleString()
                : order.createdAt}
            </p>
          </div>

          {/* SHIPPING */}
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin size={20} /> Shipping Address
            </h2>

            <p className="text-gray-300">
              {order.shippingAddress?.fullName}
            </p>
            <p className="text-gray-300">
              {order.shippingAddress?.address}
            </p>
            <p className="text-gray-300">
              {order.shippingAddress?.city} –{" "}
              {order.shippingAddress?.zip}
            </p>
            <p className="text-gray-300">
              Phone: {order.shippingAddress?.phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
