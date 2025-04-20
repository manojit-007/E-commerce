import express from "express";
import { createOrder, getAllOrders, getSellerAllOrder, getUserOrders, updateOrderStatus } from "../controllers/orderController.js";
import { verifyRole, verifyToken } from "../middleware/jsonWebToken.js";

const OrderRoute = (io) => {
  const router = express.Router();

  router.post("/createOrder", verifyToken, createOrder(io));
  router.get("/allOrders", verifyToken, getUserOrders);
  //   router.get("/getOrderDetails/:id", verifyToken, getOrderDetails);
  //   router.get("/getUserOrders", verifyToken, GetUserAllOrders);

  //   // Admin routes
    router.get("/getAllOrders", verifyToken, verifyRole("admin"), getAllOrders);
  //   router.put("/updateOrder/:id", verifyToken, verifyRole("admin"), updateOrderStatus(io));
  //   router.delete("/:id", verifyToken, verifyRole("admin"), deleteOrder);

  // Seller routes
    router.get("/getSellerOrders", verifyToken, verifyRole("seller"), getSellerAllOrder);

// update order status
  router.put("/updateOrderStatus/:id", verifyToken, updateOrderStatus);

  return router;
};

export default OrderRoute;
