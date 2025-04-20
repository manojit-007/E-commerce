import React from "react";
import { NavLink } from "react-router-dom";
import { Home, PlusCircle, List, PanelLeftClose, PanelLeftOpen, Pencil, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";

const SellerSidebar = ({ isVisible, toggleSidebar }) => {
  const menuItems = [
    { name: "Dashboard", path: "/seller/dashboard", icon: <Home size={20} /> },
    { name: "My Products", path: "/seller/products", icon: <List size={20} /> },
    { name: "Add Product", path: "/seller/add-product", icon: <PlusCircle size={20} /> },
    { name: "All orders", path: "/seller/allOrders", icon: <Boxes size={20} /> },
  ];

  return (
    <aside
    className={`bg-transparent backdrop-blur-xl text-black w-64 p-4 pr-0 fixed inset-y-0 border-r left-0 transform transition-transform duration-300 ease-in-out z-50 shadow-lg ${
      isVisible ? "translate-x-0" : "-translate-x-[100%]"
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
      <h2 className="text-xl font-bold mb-6">Seller Panel</h2>

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
  );
};

export default SellerSidebar;
