import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Suspense, lazy, useEffect } from "react";
import "./App.css";
import { checkAuthStatus } from "./redux-store/auth/authThunkFunctions";
import Loader from "@/utils/loader";
import SellerRoutes from "./page/seller/sellerRoute";
import AllProducts from "./page/productContainer/AllProducts";
import AdminRoutes from "./page/admin/adminRoutes";
import Cart from "./page/cart/cart";
import Profile from "./page/authContainer/profile";
import Order from "./page/order/order";
import AllOrders from "./page/order/allOrders";

const Home = lazy(() => import("./page/homeContainer/Home"));
const Login = lazy(() => import("./page/authContainer/Login"));
const Register = lazy(() => import("./page/authContainer/Register"));
const ProductPage = lazy(() => import("./page/productContainer/ProductPage"));
const Product = lazy(() => import("./page/productContainer/Product"));
const NotFound = lazy(() => import("./page/errorContainer/NotFound"));

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const role = user?.role || "";

  if (loading) return <Loader aria-label="Checking authentication..." />;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: window.location.pathname }}
        replace
      />
    );
  }

  if (allowedRoles.length && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) dispatch(checkAuthStatus());
  }, [dispatch]);

  if (loading) return;
  <section className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    <Loader aria-label="Initializing application..." />;
  </section>;

  return (
    <main className="min-h-screen flex flex-col">
      <Suspense fallback={<Loader aria-label="Loading content..." />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/product/:productId"
            element={
              // <PrivateRoute>
              <ProductPage />
              // </PrivateRoute>
            }
          />
          <Route
            path="/seller/*"
            element={
              <PrivateRoute allowedRoles={["seller"]}>
                <SellerRoutes />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              // <PrivateRoute>
                <AllOrders />
              // </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/order"
            element={
              <PrivateRoute>
                <Order />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminRoutes />
              </PrivateRoute>
            }
          />
          <Route path="/products" element={<Product />} />
          <Route path="/allProducts" element={<AllProducts />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Suspense>
    </main>
  );
}

export default App;
