
export interface HomestayPayload {
  name: string;
  address: string;
  city: string;
  description?: string;
  base_price: number;      // đổi từ pricePerNight → base_price cho đúng db.json
  capacity: number;
  num_rooms?: number;      // đổi từ numBedrooms → num_rooms
  bathroom_count?: number; // thêm nếu muốn hiển thị chi tiết phòng tắm
  amenities?: string[];
  images?: string[];
}

// --------------------
// Bộ lọc homestay
// --------------------
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
  base_price: number;
  capacity: number;
  num_rooms?: number;
  bathroom_count?: number;
  rating?: number;
  description?: string;
  amenities?: string[];
  status?: number;
  created_at?: string;

  // Chủ sở hữu (nếu expand user)
  host?: {
    id: number;
    name: string;
    email?: string;
  };

  // Danh sách ảnh (nếu expand homestay_images)
  images?: HomestayImage[];
}
