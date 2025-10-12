import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateOrderStatus, deleteOrder, setSelectedOrder } from "../../redux/orderSlice";
import toast from "react-hot-toast";
import { FaSearch, FaTrash, FaEdit } from 'react-icons/fa'; // Import icons for a professional look

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.orders);
  const [search, setSearch] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All"); // New state for status filter

  const filtered = items.filter(order =>
    (order.customer.toLowerCase().includes(search.toLowerCase()) ||
    order.product.toLowerCase().includes(search.toLowerCase()) ||
    order.id.toString().includes(search)) &&
    (selectedStatusFilter === "All" || order.status === selectedStatusFilter) // Apply status filter
  );

  const handleStatusChange = (id, status) => {
    dispatch(updateOrderStatus({ id, status }));
    toast.success("Order status updated ✅");
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this order?")) {
      dispatch(deleteOrder(id));
      toast.success("Order deleted 🗑️");
    }
  };

  // Helper function to get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">Pending</span>;
      case "Processing":
        return <span className="bg-blue-500 text-blue-900 px-3 py-1 rounded-full text-xs font-semibold">Processing</span>;
      case "Completed":
        return <span className="bg-green-500 text-green-900 px-3 py-1 rounded-full text-xs font-semibold">Completed</span>;
      case "Cancelled":
        return <span className="bg-red-500 text-red-900 px-3 py-1 rounded-full text-xs font-semibold">Cancelled</span>;
      default:
        return <span className="bg-gray-500 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  // Calculate dashboard metrics
  const totalOrders = items.length;
  const pendingOrders = items.filter(order => order.status === "Pending").length;
  const completedOrders = items.filter(order => order.status === "Completed").length;

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-gray-100 font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-purple-400">Order Dashboard</h1>
        {/* You can add more dashboard-like elements here, e.g., a "Create New Order" button */}
        {/* <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
          <FaPlus /> <span>New Order</span>
        </button> */}
      </div>

      {/* Dashboard Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col justify-between">
          <p className="text-lg text-gray-400">Total Orders</p>
          <p className="text-5xl font-bold text-teal-400 mt-2">{totalOrders}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col justify-between">
          <p className="text-lg text-gray-400">Pending Orders</p>
          <p className="text-5xl font-bold text-yellow-400 mt-2">{pendingOrders}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col justify-between">
          <p className="text-lg text-gray-400">Completed Orders</p>
          <p className="text-5xl font-bold text-green-400 mt-2">{completedOrders}</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search by customer, product, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-3 rounded-xl w-full bg-gray-800 text-gray-200 outline-none border border-gray-700 focus:border-purple-500 transition-all duration-200"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex items-center space-x-4">
          <label htmlFor="statusFilter" className="text-gray-300">Filter by Status:</label>
          <select
            id="statusFilter"
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-gray-800 text-gray-200 rounded-xl px-4 py-2 border border-gray-700 focus:border-purple-500 outline-none transition-all duration-200"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>


      {/* Orders Table */}
      <div className="overflow-x-auto bg-gray-800 rounded-2xl shadow-xl border border-gray-700">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 text-gray-300 text-left text-sm uppercase tracking-wider sticky top-0">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200">
                <td className="px-6 py-4 font-mono text-gray-300">{order.id}</td>
                <td className="px-6 py-4 font-medium text-purple-300">{order.customer}</td>
                <td className="px-6 py-4">{order.product}</td>
                <td className="px-6 py-4">{order.quantity}</td>
                <td className="px-6 py-4 font-semibold text-green-300">₹{order.total}</td>
                <td className="px-6 py-4">
                  {/* Status Dropdown - now visually enhanced */}
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`
                      py-2 px-3 rounded-lg text-sm font-semibold border
                      ${order.status === "Pending" && "bg-yellow-600 border-yellow-700 text-yellow-100"}
                      ${order.status === "Processing" && "bg-blue-600 border-blue-700 text-blue-100"}
                      ${order.status === "Completed" && "bg-green-600 border-green-700 text-green-100"}
                      ${order.status === "Cancelled" && "bg-red-600 border-red-700 text-red-100"}
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200
                    `}
                  >
                    <option className="bg-gray-800 text-gray-200" value="Pending">Pending</option>
                    <option className="bg-gray-800 text-gray-200" value="Processing">Processing</option>
                    <option className="bg-gray-800 text-gray-200" value="Completed">Completed</option>
                    <option className="bg-gray-800 text-gray-200" value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 flex justify-end space-x-3">
                  {/* Example of an "Edit" button if you had an edit functionality */}
                  {/* <button
                    onClick={() => dispatch(setSelectedOrder(order.id))}
                    className="p-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white transition-colors duration-200"
                    title="Edit Order"
                  >
                    <FaEdit />
                  </button> */}
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="p-2 bg-red-500 hover:bg-red-600 rounded-md text-white transition-colors duration-200"
                    title="Delete Order"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-400 italic text-lg">No orders found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;