import { Request, Response, NextFunction } from "express";
import { participantsService } from "./participants.service";
import { UnauthorizedError } from "../../utils/errors";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class ParticipantsController {
  /**
   * Join an event
   * POST /events/:eventId/join
   */
  joinEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const { eventId } = req.params;

      if (!userId) {
        throw new UnauthorizedError("Authentication required");
      }

      const result = await participantsService.joinEvent(userId, eventId);

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          participant: result.participant,
          event: result.event,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Leave an event
   * DELETE /events/:eventId/leave
   */
  leaveEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const { eventId } = req.params;

      if (!userId) {
        throw new UnauthorizedError("Authentication required");
      }

      const result = await participantsService.leaveEvent(userId, eventId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all participants for an event
   * GET /events/:eventId/participants
   */
  getEventParticipants = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { eventId } = req.params;

      const participants = await participantsService.getEventParticipants(eventId);

      res.status(200).json({
        success: true,
        data: participants,
        count: participants.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user's joined events
   * GET /participants/my-events
   */
  getMyJoinedEvents = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new UnauthorizedError("Authentication required");
      }

      const { upcoming, past } = req.query;

      const filters = {
        upcoming: upcoming === "true",
        past: past === "true",
      };

      const events = await participantsService.getUserJoinedEvents(userId, filters);

      res.status(200).json({
        success: true,
        data: events,
        count: events.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Check if user is a participant
   * GET /events/:eventId/check-participation
   */
  checkParticipation = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const { eventId } = req.params;

      if (!userId) {
        throw new UnauthorizedError("Authentication required");
      }

      const result = await participantsService.checkUserParticipation(userId, eventId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const participantsController = new ParticipantsController();
