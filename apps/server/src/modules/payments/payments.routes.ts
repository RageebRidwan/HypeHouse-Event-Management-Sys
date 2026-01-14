import { Router } from "express";
import { paymentsController } from "./payments.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

/**
 * Payment routes
 */

// Create payment intent (protected)
router.post("/create-intent", authenticate, paymentsController.createIntent);

// Stripe webhook (public, but verified by Stripe signature)
// Note: This route requires raw body, configured in server.ts
router.post("/webhook", paymentsController.webhook);

// Get payment history (protected)
router.get("/history", authenticate, paymentsController.getHistory);

export default router;
