export interface HomestayPayload {
  name: string;
  address: string;
  city: string;
  description?: string;
  pricePerNight: number;
  capacity: number;
  numBedrooms?: number;
  numBathrooms?: number;
  amenities?: string[];
  images?: string[];
}

export interface Homestay extends HomestayPayload {
  id: number;
  ownerId?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HomestayFilters {
  city?: string;
  capacity?: number;
  checkIn?: string;
  checkOut?: string;
}
