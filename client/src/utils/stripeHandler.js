import { loadStripe } from "@stripe/stripe-js";

const StripeContainer = await loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

export default StripeContainer;
