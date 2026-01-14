import { Request, Response, NextFunction } from "express";
import * as adminService from "./admin.service";
import { sendSuccess } from "../../utils/response";

/**
 * Get platform statistics
 */
export const getPlatformStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await adminService.getPlatformStats();
    sendSuccess(res, stats, "Platform statistics retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users with filters
 */
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, search, role, suspended } = req.query;

    const result = await adminService.getAllUsers({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
      role: role as string,
      suspended: suspended === "true" ? true : suspended === "false" ? false : undefined,
    });

    sendSuccess(res, result, "Users retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Get user details
 */
export const getUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const user = await adminService.getUserDetails(userId);
    sendSuccess(res, user, "User details retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Update user role
 */
export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await adminService.updateUserRole(userId, role);
    sendSuccess(res, user, "User role updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Suspend user
 */
export const suspendUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await adminService.suspendUser(userId, reason);
    sendSuccess(res, user, "User suspended successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Unsuspend user
 */
export const unsuspendUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const user = await adminService.unsuspendUser(userId);
    sendSuccess(res, user, "User unsuspended successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const result = await adminService.deleteUser(userId);
    sendSuccess(res, result, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Get all events
 */
export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, search, status, flagged } = req.query;

    const result = await adminService.getAllEvents({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
      status: status as string,
      flagged: flagged === "true" ? true : undefined,
    });

    sendSuccess(res, result, "Events retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Delete event
 */
export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;

    const result = await adminService.deleteEventAsAdmin(eventId);
    sendSuccess(res, result, "Event deleted successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Get all reports
 */
export const getAllReports = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, type, status } = req.query;

    const result = await adminService.getAllReports({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      type: type as string,
      status: status as string,
    });

    sendSuccess(res, result, "Reports retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Resolve report
 */
export const resolveReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reportId } = req.params;
    const adminId = req.user!.id;

    const report = await adminService.resolveReport(reportId, adminId);
    sendSuccess(res, report, "Report resolved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Dismiss report
 */
export const dismissReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reportId } = req.params;
    const adminId = req.user!.id;

    const report = await adminService.dismissReport(reportId, adminId);
    sendSuccess(res, report, "Report dismissed successfully");
  } catch (error) {
    next(error);
  }
};
