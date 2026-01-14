import { Router } from "express";
import * as adminController from "./admin.controller";
import { authenticate } from "../../middleware/auth";
import { requireRole } from "../../middleware/requireRole";

const router = Router();

// All admin routes require authentication and ADMIN role
router.use(authenticate);
router.use(requireRole("ADMIN"));

// Platform Stats
router.get("/stats", adminController.getPlatformStats);

// User Management
router.get("/users", adminController.getAllUsers);
router.get("/users/:userId", adminController.getUserDetails);
router.put("/users/:userId/role", adminController.updateUserRole);
router.put("/users/:userId/suspend", adminController.suspendUser);
router.put("/users/:userId/unsuspend", adminController.unsuspendUser);
router.delete("/users/:userId", adminController.deleteUser);

// Event Management
router.get("/events", adminController.getAllEvents);
router.delete("/events/:eventId", adminController.deleteEvent);

// Reports Management
router.get("/reports", adminController.getAllReports);
router.put("/reports/:reportId/resolve", adminController.resolveReport);
router.put("/reports/:reportId/dismiss", adminController.dismissReport);

export default router;
