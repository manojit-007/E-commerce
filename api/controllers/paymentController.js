// Import Section
import Stripe from "stripe";
import catchAsyncError from "../middleware/catchAsyncError.js";
import Order from "../data_models/orderModels.js";
import responseHandler from "../utils/responseHandler.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
export const createPaymentIntent = catchAsyncError(async (req, res, next) => {
  try {
    const { totalPrice, orderId, userId } = req.body;

    if (!totalPrice || !orderId || !userId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100,
      currency: "usd",
      payment_method_types: ["card"],
      description: `Payment for Order ID: ${orderId}`,
      metadata: {
        orderId,
        userId,
      },
    });

    return responseHandler(res, 200, "Payment Intent created successfully.", {
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error.message);
    return responseHandler(res, 500, "Internal server error.", {
      error: error.message || "An unknown error occurred.",
    });
  }
});

// Verify Payment
export const verifyPayment = catchAsyncError(async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: "Payment Intent ID is required." });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      const orderId = paymentIntent.metadata.orderId;
      const userId = paymentIntent.metadata.userId;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found." });
      }

      order.paymentInfo.id = paymentIntent.id;
      order.paymentInfo.status = paymentIntent.status || "paid";
      order.save();

      responseHandler(res, 200, "Payment verified successfully", {
        paymentIntent,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.log(error.message);
    return responseHandler(res, 500, "Internal server error.", {
      error: error.message || "An unknown error occurred.",
    });
  }
});
