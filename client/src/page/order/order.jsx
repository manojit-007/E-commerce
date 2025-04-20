/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from "@/components/ui/button";
import { cashOnDelivery } from "@/redux-store/order/orderSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import apiClient from "@/apiClient/apiClient";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Order = () => {
  const { order } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!order) {
      navigate("/cart");
    } else {
      document.title = `SmartBuy - Order ${order._id}`;
    }
  }, [order, navigate]);

  const handleCashOnDelivery = () => {
    dispatch(cashOnDelivery());
    navigate("/");
  };

  const handlePayNow = async () => {
    const stripe = useStripe();
    const elements = useElements();

    if (!stripe || !elements) {
      console.error("Stripe has not loaded properly.");
      return;
    }

    try {
      const response = await apiClient.post(`/payment/create-payment-intent`, {
        totalPrice: order.totalPrice,
        orderId: order._id,
        userId: order.user,
      });

      const { clientSecret } = response.data;

      const cardElement = elements.getElement(CardElement);

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        console.error("Payment failed:", error.message);
        alert("Payment failed. Please try again.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        alert("Payment successful!");
        navigate("/"); // Redirect after successful payment
      }
    } catch (error) {
      console.error("Error during payment:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (!order) {
    return <div>Loading...</div>; // Show a loading state instead of null
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Order Confirmed</h1>
        <p className="text-lg text-gray-700 mb-4">
          Thank you for your purchase! Your Order ID is <span className="font-bold">{order._id}</span>.
        </p>
        <div className="mb-4 w-96">
          <label className="block text-gray-700 mb-2">Enter Card Details:</label>
          <CardElement className="p-2 border rounded-md" />
        </div>
        <button
          onClick={handlePayNow}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800"
        >
          Pay Now
        </button>
        <Button onClick={handleCashOnDelivery} className="mt-4">
          Cash on Delivery
        </Button>
      </div>
    </Elements>
  );
};

export default Order;
