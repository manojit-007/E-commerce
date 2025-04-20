import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import {
  cashOnDelivery,
  completePayment,
} from "@/redux-store/order/orderSlice";
import apiClient from "@/apiClient/apiClient";
import { toastMessage } from "@/utils/tostMessage";

const Order = () => {
  const { order } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (!order) {
      navigate("/cart");
    } else {
      document.title = `SmartBuy - Order ${order._id}`;
    }
  }, [order, navigate]);

  const handleCashOnDelivery = () => {
    dispatch(cashOnDelivery());
    navigate("/orders");
  };

  const handlePayNow = async () => {
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

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        console.error("Payment failed:", error.message);
        alert("Payment failed. Please try again.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        const verifyResponse = await apiClient.post("/payment/verify-payment", {
          paymentIntentId: paymentIntent.id,
        });

        if (verifyResponse.data.success) {
          toastMessage("success", "Payment successful!");
          dispatch(completePayment());
          navigate("/orders");
        } else {
          toastMessage(
            "error",
            "Payment verification failed. You can pay for the product using cash on delivery."
          );
          dispatch(cashOnDelivery());
        }
      }
    } catch (error) {
      console.error("Error during payment:", error);
      toastMessage(
        "error",
        "An error occurred. Please try again. or You can pay for the product using cash on delivery."
      );
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Order Confirmation
        </h1>
        <p className="text-gray-700 text-center mb-4">
          Thank you for your purchase! Your Order ID is{" "}
          <span className="font-bold text-blue-600">{order._id}</span>.
        </p>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-semibold">
            Enter Card Details:
          </label>
          <div className="p-3 border rounded-md shadow-sm bg-gray-50">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </div>
        </div>

        <button
          onClick={handlePayNow}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Pay Now
        </button>

        <Button
          onClick={handleCashOnDelivery}
          className="w-full mt-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        >
          Cash on Delivery
        </Button>
      </div>
    </div>
  );
};

export default Order;
