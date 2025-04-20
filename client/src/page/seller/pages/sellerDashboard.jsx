import React from "react";
import { NavLink } from "react-router-dom";
import { Home, List, PlusCircle, Boxes } from "lucide-react";

const SellerDashboard = () => {
  const menuItems = [
    { name: "Dashboard", path: "/seller/dashboard", icon: <Home size={20} /> },
    { name: "My Products", path: "/seller/products", icon: <List size={20} /> },
    { name: "Add Product", path: "/seller/add-product", icon: <PlusCircle size={20} /> },
    { name: "All Orders", path: "/seller/allOrders", icon: <Boxes size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">


      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, Seller!</h1>
        <p className="text-gray-600 mb-6">
          Manage your products, monitor orders, and grow your store with ease using the tools below.
        </p>
        {/* Placeholder for future dynamic content */}
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
      </main>
    </div>
  );
};

export default SellerDashboard;
