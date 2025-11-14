import { uploadHomestayImage } from "@/api/uploadApi";
import { UploadResult } from "@/types/homestay";

/**
 * Allowed image formats
 */
const ALLOWED_FORMATS = ["image/png", "image/jpg", "image/jpeg"];

/**
 * Maximum file size in bytes (5MB)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Validate a single image file
 * @param file - File to validate
 * @throws Error if file is invalid
 */
const validateImageFile = (file: File): void => {
  // Validate file format
  if (!ALLOWED_FORMATS.includes(file.type)) {
    throw new Error(
      `File "${file.name}" không đúng định dạng. Chỉ chấp nhận PNG, JPG, JPEG.`
    );
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    throw new Error(
      `File "${file.name}" có kích thước ${sizeMB}MB vượt quá giới hạn 5MB.`
    );
  }
};

/**
 * Create a preview URL for an image file
 * @param file - File to create preview for
 * @returns Preview URL
 */
export const createPreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revoke preview URLs to free up memory
 * @param urls - Array of preview URLs to revoke
 */
export const revokePreviewUrls = (urls: string[]): void => {
  urls.forEach((url) => {
    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  });
};

/**
 * Upload multiple image files to cloud storage
 * @param files - Array of image files to upload
 * @param primaryIndex - Index of the primary image (default: 0)
 * @returns Promise resolving to array of UploadResult with URLs and metadata
 * @throws Error if any file is invalid or upload fails
 */
export const uploadImages = async (
  files: File[],
  primaryIndex: number = 0
): Promise<UploadResult[]> => {
  // Validate all files first
  files.forEach((file) => {
    validateImageFile(file);
  });

  // Upload all files in parallel
  const uploadPromises = files.map(async (file, index) => {
    try {
      // Upload to cloud storage via API
      const url = await uploadHomestayImage(file);

      return {
        url,
        alt: file.name,
        isPrimary: index === primaryIndex,
      };
    } catch (error) {
      throw new Error(
        `Không thể upload file "${file.name}": ${
          error instanceof Error ? error.message : "Lỗi không xác định"
        }`
      );
    }
  });

  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw new Error(
      `Upload hình ảnh thất bại: ${
        error instanceof Error ? error.message : "Lỗi không xác định"
      }`
    );
  }
};

/**
 * Validate and create preview URLs for multiple files
 * @param files - Array of files to validate and preview
 * @returns Array of preview URLs
 * @throws Error if any file is invalid
 */
export const validateAndPreviewFiles = (files: File[]): string[] => {
  // Validate all files
  files.forEach((file) => {
    validateImageFile(file);
  });

  // Create preview URLs
  return files.map((file) => createPreviewUrl(file));
};
