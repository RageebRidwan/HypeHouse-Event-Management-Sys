import { Router } from "express";
import * as cronController from "./cron.controller";

const router = Router();

// Cron job endpoints (protected by secret key)
router.post("/event-reminders", cronController.triggerEventReminders);

export default router;
