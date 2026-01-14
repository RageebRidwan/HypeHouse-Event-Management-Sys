import { Router } from "express";
import * as reviewsController from "./reviews.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

// Create review (auth required)
router.post("/", authenticate, reviewsController.createReview);

// Get event reviews (public)
router.get("/events/:eventId", reviewsController.getEventReviews);

// Get host reviews (public)
router.get("/users/:hostId", reviewsController.getHostReviews);

// Get user's review for event (auth required)
router.get("/events/:eventId/user", authenticate, reviewsController.getUserReview);

// Delete review (auth required)
router.delete("/:id", authenticate, reviewsController.deleteReview);

export default router;
