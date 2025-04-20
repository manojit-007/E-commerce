import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { totalPrice, orderId, userId } = req.body;

    // Validate input data
    if (!totalPrice || isNaN(totalPrice) || totalPrice <= 0) {
      return res.status(400).json({ error: "Invalid totalPrice." });
    }
    if (!orderId || typeof orderId !== "string") {
      return res.status(400).json({ error: "Invalid orderId." });
    }
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Invalid userId." });
    }

    // Convert the price to cents for Stripe
    const amount = Math.round(totalPrice * 100);

    // Create a Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    // Send the client secret back to the frontend
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error.message);
    res.status(500).json({
      error: "Failed to create Payment Intent",
      message: error.message,
    });
  }
};

// Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: "Missing paymentIntentId." });
    }

    // Retrieve the Payment Intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Check the status of the payment
    if (paymentIntent.status === "succeeded") {
      res.status(200).json({
        success: true,
        message: "Payment successful",
        paymentDetails: paymentIntent,
      });
    } else {
      res.status(400).json({
        success: false,
        message: `Payment not successful. Current status: ${paymentIntent.status}`,
        paymentDetails: paymentIntent,
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error.message);
    res.status(500).json({
      error: "Failed to verify payment",
      message: error.message,
    });
  }
};
