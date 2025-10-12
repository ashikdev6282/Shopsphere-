// src/admin/pages/AdminCustomers.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleCustomerStatus } from "../../redux/customerSlice";
import toast from "react-hot-toast";
import CustomerNotesPanel from "../components/CustomerNotesPanel";

const AdminCustomers = () => {
  const dispatch = useDispatch();
  const { customers } = useSelector((state) => state.customers);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Simulate live status updates every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      if (customers.length > 0) {
        const random = customers[Math.floor(Math.random() * customers.length)];
        const statuses = ["Active", "Inactive", "Flagged"];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        dispatch(toggleCustomerStatus({ id: random.id, status: newStatus }));
        toast(`👥 ${random.name}'s status auto-updated to ${newStatus}`);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [customers, dispatch]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex gap-6 p-6 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-gray-100">
      {/* Main Table */}
      <div className="flex-1 bg-gray-800/70 rounded-2xl p-5 shadow-lg border border-gray-700">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-pink-400">Customer Management</h2>
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded-lg bg-gray-700 text-gray-200 outline-none w-64"
          />
        </div>

        <table className="min-w-full border-collapse">
          <thead>
            <tr className="text-gray-300 bg-gray-700/60 text-sm uppercase">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Joined</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                className="border-b border-gray-700 hover:bg-gray-700/40 transition"
              >
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.email}</td>
                <td className="px-4 py-2">{c.joined}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      c.status === "Active"
                        ? "bg-green-600/30 text-green-400"
                        : c.status === "Flagged"
                        ? "bg-yellow-600/30 text-yellow-400"
                        : "bg-red-600/30 text-red-400"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => setSelectedCustomer(c)}
                    className="px-3 py-1 bg-pink-600 hover:bg-pink-700 rounded-md"
                  >
                    Notes
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400 italic">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Collaboration Notes Panel */}
      {selectedCustomer && (
        <CustomerNotesPanel
          isOpen={!!selectedCustomer}
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};

export default AdminCustomers;
