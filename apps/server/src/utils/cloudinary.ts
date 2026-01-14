import { v2 as cloudinary } from "cloudinary";
import { InternalServerError } from "./errors";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 60000, // 60 seconds timeout
});

interface UploadResult {
  secure_url: string;
  public_id: string;
}

/**
 * Upload image to Cloudinary with retry logic
 * @param fileBuffer - Image file buffer from multer
 * @param folder - Cloudinary folder name (default: 'hypehouse')
 * @param retries - Number of retry attempts (default: 2)
 * @returns Promise with secure_url and public_id
 */
export const uploadImage = async (
  fileBuffer: Buffer,
  folder: string = "hypehouse/events",
  retries: number = 2
): Promise<UploadResult> => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await new Promise<UploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: "image",
            // Simplified transformations for faster upload
            transformation: [
              { width: 1200, height: 800, crop: "limit" },
              { quality: "auto:good" },
            ],
          },
          (error, result) => {
            if (error) {
              console.error(`Cloudinary upload error (attempt ${attempt + 1}):`, error);
              reject(error);
            } else if (result) {
              resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
              });
            } else {
              reject(new Error("No result from Cloudinary"));
            }
          }
        );

        uploadStream.end(fileBuffer);
      });
    } catch (error: any) {
      if (attempt === retries) {
        // Last attempt failed
        console.error("Cloudinary upload failed after retries:", error);
        throw new InternalServerError(
          `Failed to upload image: ${error.message || "Network timeout"}`
        );
      }
      // Wait before retry (exponential backoff: 1s, 2s, 4s...)
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }

  throw new InternalServerError("Failed to upload image after retries");
};

/**
 * Delete image from Cloudinary
 * @param publicId - Cloudinary public_id of the image
 * @returns Promise with deletion result
 */
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    // Don't throw error for delete failures, just log it
  }
};

/**
 * Extract public_id from Cloudinary URL
 * @param url - Cloudinary secure_url
 * @returns public_id or null
 */
export const extractPublicId = (url: string): string | null => {
  try {
    const matches = url.match(/\/v\d+\/(.+)\.\w+$/);
    return matches ? matches[1] : null;
  } catch {
    return null;
  }
};

export default cloudinary;
