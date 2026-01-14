import { Router } from "express";
import { participantsController } from "./participants.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

/**
 * Participant routes
 */

// Get user's joined events (protected)
router.get("/my-events", authenticate, participantsController.getMyJoinedEvents);

// Join an event (protected)
router.post("/events/:eventId/join", authenticate, participantsController.joinEvent);

// Leave an event (protected)
router.delete("/events/:eventId/leave", authenticate, participantsController.leaveEvent);

// Get event participants (public)
router.get("/events/:eventId/participants", participantsController.getEventParticipants);

// Check if user is participant (protected)
router.get("/events/:eventId/check-participation", authenticate, participantsController.checkParticipation);

export default router;
