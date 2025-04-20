import React from "react";
import { NavLink } from "react-router-dom";
import { Home, PlusCircle, List, PanelLeftClose, PanelLeftOpen, ListCheck, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminSidebar = ({ isVisible, toggleSidebar }) => {
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <Home size={20} /> },
    { name: "All Products", path: "/admin/products", icon: <List size={20} /> },
    { name: "Own Products", path: "/admin/adminProducts", icon: <List size={20} /> },
    { name: "Add Product", path: "/admin/add-product", icon: <PlusCircle size={20} /> },
    { name: "All Users", path: "/admin/allUsers", icon: <ListCheck size={20} /> },
    { name: "All Orders", path: "/admin/allOrders", icon: <Boxes size={20} /> },
  ];

  return (
    <>
      {/* Sidebar Backdrop */}
      {isVisible && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white text-black w-64 p-4 pr-0 fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out shadow-lg ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Toggle Button */}
        <Button
          onClick={toggleSidebar}
          className="bg-black text-white hover:bg-gray-700 rounded p-2 absolute top-4 right-[-50px]"
        >
          {isVisible ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </Button>

        {/* Sidebar Header */}
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        {/* Navigation Menu */}
        <nav>
          <ul className="space-y-4 mr-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded ${
                      isActive
                        ? "bg-black text-white"
                        : "hover:bg-black/90 hover:text-white"
                    }`
                  }
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
