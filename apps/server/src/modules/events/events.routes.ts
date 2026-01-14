import { Router } from "express";
import {
  createEventHandler,
  getEventsHandler,
  getEventByIdHandler,
  updateEventHandler,
  deleteEventHandler,
  getHostEventsHandler,
} from "./events.controller";
import { authenticate, authorize } from "../../middleware/auth";
import { validateBody, validateQuery } from "../../middleware/validate";
import {
  createEventSchema,
  updateEventSchema,
  searchEventsSchema,
} from "./events.validation";
import upload from "../../middleware/upload";
import { UserRole } from "@prisma/client";

const router = Router();

// Public routes
router.get("/", validateQuery(searchEventsSchema), getEventsHandler);

// Protected routes - Specific paths MUST come before parameterized routes
router.get("/host/my-events", authenticate, getHostEventsHandler);

// POST route for creating events
router.post(
  "/",
  authenticate,
  upload.single("image"),
  validateBody(createEventSchema),
  createEventHandler
);

// Parameterized routes - MUST come after specific paths
router.get("/:id", getEventByIdHandler);

router.put(
  "/:id",
  authenticate,
  upload.single("image"),
  validateBody(updateEventSchema),
  updateEventHandler
);

router.delete("/:id", authenticate, deleteEventHandler);

export default router;
