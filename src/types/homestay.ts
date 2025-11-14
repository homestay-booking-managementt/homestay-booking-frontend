// ==========================================
// BACKEND DTO TYPES (Match với Java DTOs)
// ==========================================

/**
 * HomestayDTO - Response từ backend
 * Match với: HBM/homestay-service/src/main/java/hbm/homestayservice/dto/HomestayDTO.java
 */
export interface HomestayDTO {
  id: number;
  userId: number;
  name: string;
  description: string;
  address: string;
  city: string;
  lat?: number;
  longitude?: number;
  capacity: number;
  numRooms: number;
  bathroomCount: number;
  basePrice: number;
  amenities: string; // JSON string
  status: number; // 1: chờ duyệt, 2: công khai, 3: tạm ẩn, 4: bị khóa
  createdAt: string; // Format: "yyyy-MM-dd HH:mm:ss"
  updatedAt: string; // Format: "yyyy-MM-dd HH:mm:ss"
  images: HomestayImageDTO[];
}

/**
 * HomestayImageDTO - Hình ảnh homestay từ backend
 */
export interface HomestayImageDTO {
  id: number;
  homestayId: number;
  url: string;
  alt?: string;
  isPrimary: boolean;
  createdAt?: string;
}

/**
 * CreateHomestayPayload - Request body để tạo homestay mới
 * Match với: HBM/homestay-service/src/main/java/hbm/homestayservice/dto/CreateHomestayRequest.java
 */
export interface CreateHomestayPayload {
  userId: number;
  name: string;
  description: string;
  address: string;
  city: string;
  lat?: number;
  longitude?: number;
  capacity: number;
  numRooms: number;
  bathroomCount: number;
  basePrice: number;
  amenities: string; // JSON string
  images: ImageRequest[];
}

/**
 * ImageRequest - Thông tin hình ảnh trong request
 */
export interface ImageRequest {
  url: string;
  alt?: string;
  isPrimary: boolean;
}

/**
 * UpdateHomestayPayload - Request body để cập nhật homestay
 * Match với: HBM/homestay-service/src/main/java/hbm/homestayservice/dto/UpdateHomestayRequest.java
 */
export interface UpdateHomestayPayload {
  name: string;
  description: string;
  address: string;
  city: string;
  lat?: number;
  longitude?: number;
  capacity: number;
  numRooms: number;
  bathroomCount: number;
  basePrice: number;
  amenities: string; // JSON string
}

/**
 * HomestayPendingDTO - Response khi tạo yêu cầu pending
 */
export interface HomestayPendingDTO {
  id: number;
  homestayId?: number;
  userId: number;
  name: string;
  description: string;
  address: string;
  city: string;
  lat?: number;
  longitude?: number;
  capacity: number;
  numRooms: number;
  bathroomCount: number;
  basePrice: number;
  amenities: string;
  status: number; // 0: pending, 1: approved, 2: rejected
  isUpdate: boolean; // true: update request, false: create request
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// FRONTEND TYPES (Để sử dụng trong UI)
// ==========================================

/**
 * Homestay - Type cho frontend UI
 * Đã transform từ HomestayDTO
 */
export interface Homestay {
  id: number;
  name: string;
  address: string;
  city: string;
  description: string;
  pricePerNight: number; // Transformed từ basePrice
  capacity: number;
  numBedrooms: number; // Transformed từ numRooms
  numBathrooms: number; // Transformed từ bathroomCount
  amenities: string[]; // Parsed từ JSON string
  images: string[]; // Array of URLs
  status: "approved" | "pending" | "hidden" | "locked";
  isUpdate?: boolean; // true if pending update, false if pending create
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * HomestayPayload - Form data từ UI
 */
export interface HomestayPayload {
  name: string;
  address: string;
  city: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  numBedrooms: number;
  numBathrooms: number;
  amenities: string[];
  images: string[];
}

/**
 * HomestayFilters - Query parameters cho search
 */
export interface HomestayFilters {
  city?: string;
  capacity?: number;
  checkIn?: string;
  checkOut?: string;
}

/**
 * UploadResult - Kết quả upload hình ảnh
 */
export interface UploadResult {
  url: string;
  alt?: string;
  isPrimary: boolean;
}

// ==========================================
// STATUS MAPPING
// ==========================================

/**
 * Backend status codes
 * 1: Chờ duyệt (pending)
 * 2: Công khai (approved/public)
 * 3: Tạm ẩn (hidden)
 * 4: Bị khóa (locked)
 */
export enum HomestayStatus {
  PENDING = 1,
  APPROVED = 2,
  HIDDEN = 3,
  LOCKED = 4,
}

/**
 * Frontend status strings
 */
export type HomestayStatusString = "approved" | "pending" | "hidden" | "locked";

/**
 * Map backend status code to frontend string
 */
export const mapBackendStatus = (status: number): HomestayStatusString => {
  switch (status) {
    case HomestayStatus.PENDING:
      return "pending";
    case HomestayStatus.APPROVED:
      return "approved";
    case HomestayStatus.HIDDEN:
      return "hidden";
    case HomestayStatus.LOCKED:
      return "locked";
    default:
      return "pending";
  }
};

/**
 * Map frontend status string to backend code
 */
export const mapFrontendStatus = (status: HomestayStatusString): number => {
  switch (status) {
    case "pending":
      return HomestayStatus.PENDING;
    case "approved":
      return HomestayStatus.APPROVED;
    case "hidden":
      return HomestayStatus.HIDDEN;
    case "locked":
      return HomestayStatus.LOCKED;
    default:
      return HomestayStatus.PENDING;
  }
};
