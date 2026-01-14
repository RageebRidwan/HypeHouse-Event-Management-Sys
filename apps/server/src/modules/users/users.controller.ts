import type { Request, Response } from "express";
import {
  getUserById,
  updateUserProfile,
  uploadProfileImage,
  getProfileCompletion,
  updateProfileExtended,
  acceptHostTerms,
} from "./users.service";
import { updateProfileSchema } from "./users.validation";

export const usersController = {
  // GET /users/:id - Get user profile
  getUserProfile: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const profile = await getUserById(id);

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Failed to fetch user profile",
      });
    }
  },

  // PUT /users/:id - Update user profile
  updateProfile: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      // Validate input
      const validatedData = updateProfileSchema.parse(req.body);

      const profile = await updateUserProfile(id, userId, validatedData);

      res.status(200).json({
        success: true,
        data: profile,
        message: "Profile updated successfully",
      });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      res.status(err.statusCode || 400).json({
        success: false,
        error: err.message || "Failed to update profile",
      });
    }
  },

  // POST /users/profile-image - Upload profile image
  uploadImage: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No image file provided",
        });
      }

      const imageUrl = await uploadProfileImage(
        userId,
        req.file.buffer,
        req.file.mimetype
      );

      res.status(200).json({
        success: true,
        data: { imageUrl },
        message: "Profile image uploaded successfully",
      });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || "Failed to upload image",
      });
    }
  },

  // GET /users/profile-completion - Get profile completion status
  getCompletion: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      const completion = await getProfileCompletion(userId);

      res.status(200).json({
        success: true,
        data: completion,
      });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || "Failed to get profile completion",
      });
    }
  },

  // PUT /users/profile-extended - Update extended profile
  updateExtendedProfile: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      const completion = await updateProfileExtended(userId, req.body);

      res.status(200).json({
        success: true,
        data: completion,
        message: "Profile updated successfully",
      });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      res.status(err.statusCode || 400).json({
        success: false,
        error: err.message || "Failed to update profile",
      });
    }
  },

  // POST /users/accept-host-terms - Accept host terms
  acceptTerms: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      const result = await acceptHostTerms(userId);

      res.status(200).json({
        success: true,
        data: result,
        message: result.message,
      });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      res.status(err.statusCode || 400).json({
        success: false,
        error: err.message || "Failed to accept terms",
      });
    }
  },
};
