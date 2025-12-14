// src/pages/admin/AdminOrders.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setOrders,
  updateOrderStatus as updateOrderStatusAction,
  deleteOrder as deleteOrderAction,
} from "../../redux/orderSlice";
import toast from "react-hot-toast";
import { FaSearch, FaTrash } from "react-icons/fa";
import {
  fetchAllOrders,
  updateOrderStatusById,
  deleteOrderById,
} from "../../firebase/services/orderService";

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.orders);

  const [search, setSearch] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  /** 🔥 LOAD ORDERS FROM FIRESTORE */
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchAllOrders();
        if (!cancelled) dispatch(setOrders(data));
      } catch (err) {
        console.error("Failed to load orders", err);
        toast.error("Could not load orders.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => (cancelled = true);
  }, [dispatch]);

  /** 🔍 FIXED SEARCH FUNCTION (no more errors) */
  const filtered = (items || []).filter((order) => {
    const searchText = search.toLowerCase();

    const customer = (order.customerName || "").toLowerCase();
    const products = order.items
      ? order.items
          .map((i) => i.name)
          .join(" ")
          .toLowerCase()
      : "";

    const id = String(order.id || "").toLowerCase();

    const matchesSearch =
      customer.includes(searchText) ||
      products.includes(searchText) ||
      id.includes(searchText);

    const matchesStatus =
      selectedStatusFilter === "All" || order.status === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  /** 🔄 UPDATE STATUS */
  const handleStatusChange = async (id, status, newStatus) => {
    try {
      await updateOrderStatusById(id, { status: newStatus });
      dispatch(updateOrderStatusAction({ id, status }));
      toast.success("Order status updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  /** 🗑 DELETE ORDER */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      await deleteOrderById(id);
      dispatch(deleteOrderAction(id));
      toast.success("Order deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete order.");
    }
  };

  /** 📊 DASHBOARD METRICS */
  const totalOrders = (items || []).length;
  const pendingOrders = (items || []).filter(
    (o) => o.status === "Pending"
  ).length;
  const completedOrders = (items || []).filter(
    (o) => o.status === "Completed"
  ).length;

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-gray-100">
      {/* HEADER */}
      <h1 className="text-4xl font-extrabold mb-8 text-purple-400">
        Order Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
          <p className="text-lg text-gray-400">Total Orders</p>
          <p className="text-5xl font-bold text-teal-400 mt-2">{totalOrders}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
          <p className="text-lg text-gray-400">Pending Orders</p>
          <p className="text-5xl font-bold text-yellow-400 mt-2">
            {pendingOrders}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
          <p className="text-lg text-gray-400">Completed Orders</p>
          <p className="text-5xl font-bold text-green-400 mt-2">
            {completedOrders}
          </p>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        {/* Search Box */}
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search by customer, product, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-3 rounded-xl w-full bg-gray-800 border border-gray-700 text-gray-200 focus:border-purple-500 outline-none"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Status Filter */}
        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="bg-gray-800 text-gray-200 rounded-xl px-4 py-2 border border-gray-700 focus:border-purple-500"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* ORDERS TABLE */}
      <div className="overflow-x-auto bg-gray-800 rounded-2xl shadow-xl border border-gray-700">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 text-gray-300 uppercase text-sm tracking-wider">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-10 text-gray-400 italic"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              filtered.map((order) => {
                const itemSummary = Array.isArray(order.items)
                  ? order.items
                      .map((i) => `${i.name} × ${i.quantity}`)
                      .join(", ")
                  : "No items";

                return (
                  <tr
                    key={order.id}
                    className="border-b border-gray-700 hover:bg-gray-700/40 transition"
                  >
                    <td className="px-6 py-4 font-mono">{order.id}</td>

                    <td className="px-6 py-4 text-purple-300 font-medium">
                      {order.customerName}
                    </td>

                    <td className="px-6 py-4">{itemSummary}</td>

                    <td className="px-6 py-4 text-green-300 font-semibold">
                      ₹{order.totalAmount}
                    </td>

                    {/* STATUS DROPDOWN */}
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className={`px-3 py-2 rounded-lg text-sm font-semibold border ${
                          order.status === "Pending"
                            ? "bg-yellow-600/40 border-yellow-500 text-yellow-300"
                            : order.status === "Processing"
                            ? "bg-blue-600/40 border-blue-500 text-blue-300"
                            : order.status === "Completed"
                            ? "bg-green-600/40 border-green-500 text-green-300"
                            : "bg-red-600/40 border-red-500 text-red-300"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 flex justify-end gap-3">
                      {/* VIEW DETAILS */}
                      <button
                        onClick={() =>
                          (window.location.href = `/admin/orders/${order.id}`)
                        }
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
                      >
                        View
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 rounded-md text-white"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
