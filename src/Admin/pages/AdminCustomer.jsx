// src/admin/pages/AdminCustomers.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase_config";
import toast from "react-hot-toast";
import CustomerNotesPanel from "../components/CustomerNotesPanel";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, "users"));

        const list = snap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Unnamed User",
            email: data.email || "—",
            joined: data.createdAt?.toDate
              ? data.createdAt.toDate().toLocaleDateString()
              : "—",
            status: data.status || "Active",
            role: data.role || "user",
            unread: 0,
            lastMessage: "",
          };
        });

        setCustomers(list);
      } catch (err) {
        console.error("FETCH USERS ERROR:", err);
        toast.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  /* ================= REAL-TIME UNREAD + LAST MESSAGE ================= */
  useEffect(() => {
    if (customers.length === 0) return;

    const unsubs = customers.map((customer) => {
      const q = query(
        collection(db, "supportChats", customer.id, "messages"),
        where("sender", "==", "user"),
        where("read", "==", false)
      );

      return onSnapshot(q, (snap) => {
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === customer.id
              ? {
                  ...c,
                  unread: snap.size,
                }
              : c
          )
        );

        // 🔔 Notification
        if (snap.docChanges().some((c) => c.type === "added")) {
          toast(`💬 New message from ${customer.name}`);
        }
      });
    });

    return () => unsubs.forEach((u) => u());
  }, [customers.length]);

  /* ================= SEARCH ================= */
  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex gap-6 p-6 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-gray-100">
      <div className="flex-1 bg-gray-800/70 rounded-2xl p-5 shadow-lg border border-gray-700">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-pink-400">
            Customer Management
          </h2>
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded-lg bg-gray-700 text-gray-200 outline-none w-64"
          />
        </div>

        {loading ? (
          <p className="text-gray-400 py-10 text-center">
            Loading customers…
          </p>
        ) : (
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
                  <td className="px-4 py-2">
                    {c.name}
                    {c.unread > 0 && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-red-600 rounded-full">
                        {c.unread}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">{c.email}</td>
                  <td className="px-4 py-2">{c.joined}</td>
                  <td className="px-4 py-2">
                    <span className="px-3 py-1 rounded-full text-sm bg-green-600/30 text-green-400">
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
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-400 italic"
                  >
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {selectedCustomer && (
        <CustomerNotesPanel
          isOpen={true}
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};

export default AdminCustomers;
