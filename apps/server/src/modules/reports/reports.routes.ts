import { Router } from "express";
import * as reportsController from "./reports.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

// All report routes require authentication
router.use(authenticate);

// Report Management
router.post("/", reportsController.createReport);
router.get("/my", reportsController.getMyReports);

export default router;
