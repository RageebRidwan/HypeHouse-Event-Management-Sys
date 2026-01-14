import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = (): Promise<Stripe | null> | null => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

  if (!publishableKey) {
    console.warn(
      "Stripe public key is not configured. Payment features will be disabled. " +
      "Please set NEXT_PUBLIC_STRIPE_PUBLIC_KEY in your .env.local file."
    );
    return null;
  }

  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
};
