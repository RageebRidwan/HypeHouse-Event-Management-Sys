import { Request, Response, NextFunction } from "express";
import * as reportsService from "./reports.service";
import { sendSuccess } from "../../utils/response";

/**
 * Create a new report
 */
export const createReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const report = await reportsService.createReport(userId, req.body);
    sendSuccess(res, report, "Report submitted successfully", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user's reports
 */
export const getMyReports = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const reports = await reportsService.getMyReports(userId);
    sendSuccess(res, reports, "Reports retrieved successfully");
  } catch (error) {
    next(error);
  }
};
