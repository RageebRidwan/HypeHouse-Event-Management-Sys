import { Router } from "express";
import multer from "multer";
import { usersController } from "./users.controller";
import * as notificationPreferencesController from "./notification-preferences.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

/**
 * User routes
 */

// Specific routes MUST come before parameterized routes

// Upload profile image (protected)
router.post(
  "/profile-image",
  authenticate,
  upload.single("image"),
  usersController.uploadImage
);

// Get profile completion (protected)
router.get("/profile-completion", authenticate, usersController.getCompletion);

// Update extended profile (protected)
router.put("/profile-extended", authenticate, usersController.updateExtendedProfile);

// Accept host terms (protected)
router.post("/accept-host-terms", authenticate, usersController.acceptTerms);

// Notification preferences (protected)
router.get("/notification-preferences", authenticate, notificationPreferencesController.getNotificationPreferences);
router.put("/notification-preferences", authenticate, notificationPreferencesController.updateNotificationPreferences);

// Get user profile (public)
router.get("/:id", usersController.getUserProfile);

// Update user profile (protected)
router.put("/:id", authenticate, usersController.updateProfile);

export default router;
