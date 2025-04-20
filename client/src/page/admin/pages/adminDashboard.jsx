import React from "react";
import { NavLink } from "react-router-dom";
import { Home, List, PlusCircle, ListCheck, Boxes } from "lucide-react";

const AdminDashboard = () => {
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <Home size={24} /> },
    { name: "All Products", path: "/admin/products", icon: <List size={24} /> },
    { name: "Own Products", path: "/admin/adminProducts", icon: <List size={24} /> },
    { name: "Add Product", path: "/admin/add-product", icon: <PlusCircle size={24} /> },
    { name: "All Users", path: "/admin/allUsers", icon: <ListCheck size={24} /> },
    { name: "All Orders", path: "/admin/allOrders", icon: <Boxes size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">Admin Dashboard</h1>
        <p className="text-gray-700 text-lg">
          Manage your products, users, and orders effortlessly from here.
        </p>
      </header>

      {/* Navigation Menu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center p-6 rounded-xl shadow-lg transition ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-100"
              }`
            }
          >
            <div className="mb-3">{item.icon}</div>
            <span className="text-lg font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
