import express from "express";
import {
  createOrder,
  getAllOrders,
  getSellerAllOrder,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { verifyRole, verifyToken } from "../middleware/jsonWebToken.js";

const OrderRoute = (io) => {
  const router = express.Router();

  // User routes
  router.post("/createOrder", verifyToken, createOrder(io));
  router.get("/allOrders", verifyToken, getUserOrders);

  // Admin routes
  router.get("/getAllOrders", verifyToken, verifyRole("admin"), getAllOrders);

  // Seller routes
  router.get(
    "/getSellerOrders",
    verifyToken,
    verifyRole("seller"),
    getSellerAllOrder
  );

  // Update order status
  router.put("/updateOrderStatus/:id", verifyToken, updateOrderStatus);

  return router;
};

export default OrderRoute;
