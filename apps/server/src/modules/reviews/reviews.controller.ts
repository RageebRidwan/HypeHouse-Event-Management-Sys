import { Request, Response, NextFunction } from "express";
import * as reviewsService from "./reviews.service";
import { createReviewSchema } from "./reviews.validation";

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validatedData = createReviewSchema.parse(req.body);

    const review = await reviewsService.createReview({
      userId,
      ...validatedData,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;

    const reviews = await reviewsService.getEventReviews(eventId);

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const getHostReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { hostId } = req.params;

    const result = await reviewsService.getHostReviews(hostId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    const result = await reviewsService.deleteReview(id, userId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { eventId } = req.params;

    const review = await reviewsService.getUserReview(userId, eventId);

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};
