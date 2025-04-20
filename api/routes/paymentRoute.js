import express from "express";
import { createPaymentIntent, verifyPayment } from "../controllers/paymentController.js";

const PaymentRouter = express.Router();

/** ----------------------- Payment Intent ----------------------- */
// Route to create a Stripe Payment Intent
PaymentRouter.post("/create-payment-intent", createPaymentIntent);

/** ----------------------- Payment Verification ----------------------- */
// Route to verify payment status
PaymentRouter.post("/verify-payment", verifyPayment);

export default PaymentRouter;
