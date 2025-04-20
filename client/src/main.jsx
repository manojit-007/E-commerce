import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Store from "./redux-store/store";
import { Toaster } from "@/components/ui/sonner";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

createRoot(document.getElementById("root")).render(
  <Provider store={Store}>
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
      <Toaster richColors position="bottom-right" closeButton />
    </BrowserRouter>
  </Provider>
);
