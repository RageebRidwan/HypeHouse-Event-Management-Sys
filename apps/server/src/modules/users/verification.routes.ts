import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { requireRole } from "../../middleware/requireRole";
import * as verificationController from "./verification.controller";

const router = Router();

// User endpoints
router.post(
  "/request",
  authenticate,
  verificationController.requestVerification
);

router.get(
  "/status",
  authenticate,
  verificationController.getVerificationStatus
);

// Admin endpoints
router.get(
  "/pending",
  authenticate,
  requireRole("ADMIN"),
  verificationController.getPendingRequests
);

router.post(
  "/approve/:userId",
  authenticate,
  requireRole("ADMIN"),
  verificationController.approveVerification
);

router.post(
  "/reject/:userId",
  authenticate,
  requireRole("ADMIN"),
  verificationController.rejectVerification
);

export default router;
