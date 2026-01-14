import { Request, Response, NextFunction } from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getHostEvents,
} from "./events.service";
import { sendSuccess, sendCreated } from "../../utils/response";
import type {
  CreateEventInput,
  UpdateEventInput,
  SearchEventsInput,
} from "./events.validation";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const createEventHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const data: CreateEventInput = req.body;
    const imageBuffer = req.file?.buffer;

    const event = await createEvent(userId, data, imageBuffer);

    sendCreated(res, event, "Event created successfully");
  } catch (error) {
    next(error);
  }
};

export const getEventsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filters: SearchEventsInput = req.query as any;

    const result = await getEvents(filters);

    sendSuccess(res, result, "Events retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getEventByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id; // Optional - user may not be authenticated

    const event = await getEventById(id, userId);

    sendSuccess(res, event, "Event retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const updateEventHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const data: UpdateEventInput = req.body;
    const imageBuffer = req.file?.buffer;

    const event = await updateEvent(id, userId, data, imageBuffer);

    sendSuccess(res, event, "Event updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteEventHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    await deleteEvent(id, userId);

    sendSuccess(res, "Event deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const getHostEventsHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const events = await getHostEvents(userId);

    sendSuccess(res, events, "Host events retrieved successfully");
  } catch (error) {
    next(error);
  }
};
