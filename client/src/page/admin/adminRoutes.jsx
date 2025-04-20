import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminDashboard from "./pages/adminDashboard";
import AdminSidebar from "./components/adminSideBar";
import NotFound from "../errorContainer/NotFound";
import AddProduct from "./pages/addProduct";
import AllProducts from "./pages/allProducts";
import UserList from "./pages/userList";
import AllOrders from "../order/allOrders";
import ListedProducts from "./pages/listedProducts";
import EditProduct from "./pages/editProduct";

const AdminRoutes = () => {
  const { isAdmin } = useSelector((state) => state.auth);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const location = useLocation();
  const sidebarRef = useRef(null);

  // Automatically hide sidebar on route change for better UX
  useEffect(() => {
    setIsSidebarVisible(false);
  }, [location.pathname]);

  // Hide sidebar on outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle Sidebar Visibility
  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);

  if (!isAdmin) {
    // Redirect non-admin users to a "Not Found" page
    return <Navigate to="/notFound" replace />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div ref={sidebarRef}>
        <AdminSidebar isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-gray-100">
        <Routes>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/allUsers" element={<UserList />} />
          <Route path="/allOrders" element={<AllOrders />} />
          <Route path="/adminProducts" element={<ListedProducts />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminRoutes;
