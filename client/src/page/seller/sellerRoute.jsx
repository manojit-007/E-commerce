import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SellerDashboard from "./pages/sellerDashboard";
import ProductList from "./pages/productList";
import AddProduct from "./pages/addProduct";
import SellerSidebar from "./components/sellerSidebar";
import EditProduct from "./pages/editProduct";
import NotFound from "../errorContainer/NotFound";
import AllOrders from "../order/allOrders";

const SellerRoutes = () => {
  const { isSeller } = useSelector((state) => state.auth);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const location = useLocation();
  const sidebarRef = useRef(null);

  // Toggle sidebar visibility on route change
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

  if (!isSeller) {
    // Redirect non-seller users to a "not found" page
    return <Navigate to="/notFound" replace />;
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div ref={sidebarRef}>
        <SellerSidebar isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <Routes>
          <Route path="/dashboard" element={<SellerDashboard />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/allOrders" element={<AllOrders />} />
          <Route path="/notFound" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default SellerRoutes;
