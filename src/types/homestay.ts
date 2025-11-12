// export interface HomestayPayload {
//   name: string;
//   address: string;
//   city: string;
//   description?: string;
//   pricePerNight: number;
//   capacity: number;
//   numBedrooms?: number;
//   numBathrooms?: number;
//   amenities?: string[];
//   images?: string[];
// }

// // export interface Homestay extends HomestayPayload {
// //   id: number;
// //   ownerId?: number;
// //   status?: string;
// //   createdAt?: string;
// //   updatedAt?: string;
// // }

// export interface HomestayFilters {
//   city?: string;
//   capacity?: number;
//   checkIn?: string;
//   checkOut?: string;
// }
// export interface HomestayImage {
//   id: number;
//   homestay_id: number;
//   url: string;
//   alt?: string;
//   is_primary?: boolean;
// }

// export interface Homestay {
//   id: number;
//   name: string;
//   address: string;
//   base_price: number;
//   capacity: number;
//   num_rooms?: number;
//   rating?: number;
//   description?: string;
//   homestay_image?: HomestayImage[];
// }

// --------------------
// Thông tin gửi lên khi tạo/sửa
// --------------------
export interface HomestayPayload {
  name: string;
  address: string;
  city: string;
  description?: string;
  base_price: number;
  capacity: number;
  num_rooms?: number;
  bathroom_count?: number;
  amenities?: string[];
  images?: string[];
}

export interface HomestayFilters {
  city?: string;
  capacity?: number;
  checkIn?: string;
  checkOut?: string;
}

// --------------------
// Bảng ảnh homestay
// --------------------
export interface HomestayImage {
  id: number;
  homestay_id: number;
  url: string;
  alt?: string;
  is_primary?: boolean;
}

// --------------------
// Bảng homestay chính
// --------------------
export interface Homestay {
  id: number;
  name: string;
  address: string;
  city?: string;
  base_price?: number; // snake_case (database format)
  basePrice?: number; // camelCase (API format from Java)
  capacity: number;
  num_rooms?: number; // snake_case
  numRooms?: number; // camelCase
  bathroom_count?: number; // snake_case
  bathroomCount?: number; // camelCase
  rating?: number;
  description?: string;
  amenities?: string[];
  status?: number; // 0: Inactive, 1: Active, 2: Pending, 3: Banned
  created_at?: string; // snake_case
  createdAt?: string; // camelCase
  updated_at?: string; // snake_case
  updatedAt?: string; // camelCase
  isUpdate?: boolean; // true if pending update, false if pending create
  ownerId?: number;
  userId?: number; // Alias for ownerId

  // Chủ sở hữu (nếu expand user)
  host?: {
    id: number;
    name: string;
    email?: string;
  };

  // Danh sách ảnh (nếu expand homestay_images)
  images?: HomestayImage[];
}

// --------------------
// Lịch sử trạng thái homestay
// --------------------
export interface HomestayStatusHistory {
  id: number;
  homestayId: number;
  oldStatus: number;
  newStatus: number;
  reason?: string;
  changedBy?: number;
  changedByName?: string;
  changedByEmail?: string;
  changedAt: string;
}
