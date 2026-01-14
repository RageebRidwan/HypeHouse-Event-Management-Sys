import type { Request, Response } from "express";
import { createPaymentIntent, handleWebhook, getPaymentHistory } from "./payments.service";
import { createPaymentIntentSchema } from "./payments.validation";

export const paymentsController = {
  // POST /payments/create-intent - Create payment intent
  createIntent: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      // Validate input
      const validatedData = createPaymentIntentSchema.parse(req.body);

      const paymentIntent = await createPaymentIntent(userId, validatedData.eventId);

      res.status(200).json({
        success: true,
        data: paymentIntent,
      });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      res.status(err.statusCode || 400).json({
        success: false,
        error: err.message || "Failed to create payment intent",
      });
    }
  },

  // POST /payments/webhook - Handle Stripe webhook
  webhook: async (req: Request, res: Response) => {
    try {
      const signature = req.headers["stripe-signature"];

      if (!signature || typeof signature !== "string") {
        return res.status(400).json({
          success: false,
          error: "Missing stripe-signature header",
        });
      }

      // req.body should be raw buffer for webhook
      const rawBody = req.body;

      await handleWebhook(signature, rawBody);

      res.status(200).json({ received: true });
    } catch (error: unknown) {
      const err = error as { message?: string };
      if (process.env.NODE_ENV !== "production") {
        console.error("Webhook error:", error);
      }
      res.status(400).json({
        success: false,
        error: err.message || "Webhook processing failed",
      });
    }
  },

  // GET /payments/history - Get user's payment history
  getHistory: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      const history = await getPaymentHistory(userId);

      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || "Failed to fetch payment history",
      });
    }
  },
};
