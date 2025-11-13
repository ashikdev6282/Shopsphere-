// src/admin/pages/Dashboard.jsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";
import { Users, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

export default function Dashboard() {
  // Mock stats
  const stats = [
    { title: "Total Users", value: 1200, icon: <Users className="w-6 h-6 text-blue-500" /> },
    { title: "Total Orders", value: 350, icon: <ShoppingCart className="w-6 h-6 text-green-500" /> },
    { title: "Revenue", value: "$12.5k", icon: <DollarSign className="w-6 h-6 text-yellow-500" /> },
    { title: "Growth", value: "18%", icon: <TrendingUp className="w-6 h-6 text-purple-500" /> },
  ];

  const chartData = [
    { month: "Jan", sales: 400 },
    { month: "Feb", sales: 800 },
    { month: "Mar", sales: 650 },
    { month: "Apr", sales: 900 },
    { month: "May", sales: 1200 },
    { month: "Jun", sales: 1100 },
    { month: "Jul", sales: 1400 },
  ];

  const lineData = [
    { month: "Jan", revenue: 2400 },
    { month: "Feb", revenue: 3200 },
    { month: "Mar", revenue: 2800 },
    { month: "Apr", revenue: 4000 },
    { month: "May", revenue: 4600 },
    { month: "Jun", revenue: 5000 },
  ];

  const topProducts = [
    { id: 1, name: "Wireless Earbuds", sales: 120 },
    { id: 2, name: "Smartwatch", sales: 95 },
    { id: 3, name: "Laptop Stand", sales: 80 },
    { id: 4, name: "Bluetooth Speaker", sales: 60 },
  ];

  const recentOrders = [
    { id: 101, customer: "John Doe", total: "$250", status: "Delivered" },
    { id: 102, customer: "Jane Smith", total: "$120", status: "Pending" },
    { id: 103, customer: "Michael Lee", total: "$340", status: "Shipped" },
  ];

  const recentUsers = [
    { id: 1, name: "Emily Johnson", email: "emily@example.com", joined: "Sep 20" },
    { id: 2, name: "David Lee", email: "david@example.com", joined: "Sep 18" },
    { id: 3, name: "Sophia Chen", email: "sophia@example.com", joined: "Sep 15" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-8">
      {/* Header */}
      <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 sm:gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-5 hover:shadow-lg transition"
          >
            <div className="p-2 sm:p-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0">
              {stat.icon}
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">{stat.title}</p>
              <h2 className="text-lg sm:text-xl font-semibold">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Sales Bar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Monthly Sales</h2>
        <div className="w-full h-[250px] sm:h-[300px] md:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="hidden sm:block" />
              <XAxis dataKey="month" stroke="#8884d8" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales Trend (Line Chart) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Revenue Trend</h2>
        <div className="w-full h-[250px] sm:h-[300px] md:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" className="hidden sm:block" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products + Recent Orders + Recent Users */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
          <h2 className="text-lg font-bold mb-4">Top Products</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2">Product</th>
                <th className="p-2">Sales</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">{product.sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
          <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
          <ul className="divide-y">
            {recentOrders.map((order) => (
              <li key={order.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{order.customer}</p>
                  <p className="text-sm text-gray-500">Order #{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{order.total}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
          <h2 className="text-lg font-bold mb-4">Recent Users</h2>
          <ul className="divide-y">
            {recentUsers.map((user) => (
              <li key={user.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <span className="text-xs text-gray-400">Joined {user.joined}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
