import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.routes";
import eventRoutes from "./modules/events/events.routes";
import participantRoutes from "./modules/participants/participants.routes";
import userRoutes from "./modules/users/users.routes";
import paymentRoutes from "./modules/payments/payments.routes";
import reviewRoutes from "./modules/reviews/reviews.routes";
import adminRoutes from "./modules/admin/admin.routes";
import reportsRoutes from "./modules/reports/reports.routes";
import cronRoutes from "./modules/cron/cron.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { paymentsController } from "./modules/payments/payments.controller";
import { startCronJobs } from "./jobs/scheduler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(morgan("dev"));

// Stripe webhook route (MUST be before express.json() to get raw body)
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentsController.webhook
);

// JSON body parser for all other routes
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Hypehouse API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/participants", participantRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/cron", cronRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Start automated cron jobs
  startCronJobs();
});

export default app;
