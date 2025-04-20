import mongoose from "mongoose";
import Order from "../data_models/orderModels.js";
import Product from "../data_models/productModels.js";
import User from "../data_models/userModels.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import SendEmail from "../middleware/sendEmail.js";
import { orderConfirmationTemplate } from "../utils/emailTemplates.js";
import responseHandler from "../utils/responseHandler.js";
import socketEvent from "../utils/socketEvent.js";

// Create Order
const createOrder = (io) =>
  catchAsyncError(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, sellerId } = req.body;
    const processedPaymentInfo =
      paymentInfo && Object.keys(paymentInfo).length > 0
        ? paymentInfo
        : {
            id: `cash_on_delivery_${Date.now()}`,
            status: "Pending",
          };

    if (!shippingInfo) {
      return responseHandler(res, 400, "Shipping Info required.");
    }
    if (!orderItems) {
      return responseHandler(res, 400, "Order Items are required.");
    }

    const productIds = orderItems.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    const restCartItems = [];
    const orderCartItems = [];

    for (const item of orderItems) {
      const product = products.find((p) => p._id.toString() === item.product);

      if (!product) {
        restCartItems.push(item);
      } else if (product.quantity > 0 && product.quantity < item.quantity) {
        const fulfilledQuantity = product.quantity;
        const remainingQuantity = item.quantity - fulfilledQuantity;

        product.quantity = 0;
        await product.save();

        orderCartItems.push({
          ...item,
          quantity: fulfilledQuantity,
        });

        socketEvent(io, "productUpdate", {
          id: product._id,
          ...product.toObject(),
        });

        restCartItems.push({
          ...item,
          quantity: remainingQuantity,
        });
      } else if (product.quantity >= item.quantity) {
        product.quantity -= item.quantity;
        await product.save();

        socketEvent(io, "productUpdate", {
          id: product._id,
          ...product.toObject(),
        });

        orderCartItems.push(item);
      } else {
        restCartItems.push(item);
      }
    }

    if (orderCartItems.length === 0) {
      return responseHandler(res, 400, "All items are out of stock", {
        restCartItems,
      });
    }

    const itemsPrice = orderCartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const taxPrice = parseFloat((itemsPrice * 0.05).toFixed(2));
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const order = await Order.create({
      sellerId,
      user: req.user.id,
      orderItems: orderCartItems,
      shippingInfo,
      paymentInfo: processedPaymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    (async () => {
      try {
        const htmlContent = await orderConfirmationTemplate(
          req.user.name,
          order._id,
          order.orderItems,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
          shippingInfo
        );

        await SendEmail({
          email: req.user.email,
          subject: "Order Confirmation",
          isHtml: true,
          message: htmlContent,
        });
      } catch (error) {
        console.error("Error sending order confirmation email:", error);
      }
    })();

    return responseHandler(res, 201, "Order created successfully.", {
      order,
      restCartItems,
    });
  });

// Get all orders for a user
const getUserOrders = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const orders = await Order.find({ user: userId }).populate("user", "name email");
  if (!orders) {
    return responseHandler(res, 404, "No orders found for this user.");
  }
  return responseHandler(res, 200, "Orders retrieved successfully.", { orders });
});

// Get all orders for a seller
const getSellerAllOrder = catchAsyncError(async (req, res, next) => {
  const sellerId = req.user.id;
  const orders = await Order.find({ sellerId }).populate("user", "name email");
  if (!orders) {
    return responseHandler(res, 404, "No orders found for this seller.");
  }
  return responseHandler(res, 200, "Orders retrieved successfully.", { orders });
});

// Admin get all orders
const getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find().populate("user", "name email");
  if (!orders) {
    return responseHandler(res, 404, "No orders found.");
  }
  return responseHandler(res, 200, "Orders retrieved successfully.", { orders });
});

// Update order status
const updateOrderStatus = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return responseHandler(res, 400, "Invalid order ID.");
  }

  const order = await Order.findById(id);
  if (!order) {
    return responseHandler(res, 404, "Order not found.");
  }

  if (req.user.role === "admin") {
    order.orderStatus = status;
    if (order.paymentInfo.status === "Pending" && status === "Delivered") {
      order.paymentInfo.status = "Paid";
    }
    await order.save();
    return responseHandler(res, 200, "Order status updated successfully.", { id, status });
  }

  if (req.user.role === "seller") {
    if (req.user.id.toString() !== order.sellerId.toString()) {
      return responseHandler(res, 403, "Not authorized to update this order.");
    }

    order.orderStatus = status;
    if (order.paymentInfo.status === "Pending" && status === "Delivered") {
      order.paymentInfo.status = "Paid";
    }
    await order.save();
    return responseHandler(res, 200, "Order status updated successfully.", { id, status });
  }

  return responseHandler(res, 403, "You are not authorized to update order status.");
});

export {
  createOrder,
  getUserOrders,
  getSellerAllOrder,
  getAllOrders,
  updateOrderStatus,
};
