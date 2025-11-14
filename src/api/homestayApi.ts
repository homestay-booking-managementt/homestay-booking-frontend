import type { 
  Homestay, 
  HomestayFilters, 
  HomestayPayload,
  HomestayDTO,
  CreateHomestayPayload,
  UpdateHomestayPayload,
  HomestayPendingDTO
} from "@/types/homestay";
import { mapBackendStatus } from "@/types/homestay";
import { sendRequest } from "@/utils/sendRequest";
import { store } from "@/app/store";

  export const fetchHomestays = async (filters?: HomestayFilters) => {
  const query = filters
    ? "?" +
      new URLSearchParams(
        Object.entries(filters).reduce((acc, [k, v]) => {
          if (v !== undefined && v !== null && v !== "") acc[k] = String(v);
          return acc;
        }, {} as Record<string, string>)
      ).toString()
    : "";

  const res = await sendRequest(`http://localhost:8082/api/homestays${query}`, {
    method: "GET",
  });
  return res?.data ?? [];
};

/**
 * Lấy chi tiết homestay theo ID
 * @param homestayId - ID của homestay cần lấy
 * @returns Promise<Homestay> - Homestay đã transform sang frontend format
 * @throws Error nếu không tìm thấy homestay hoặc API call thất bại
 */
export const fetchHomestayById = async (homestayId: number): Promise<Homestay> => {
  try {
    // Gọi API GET /api/homestays/{id} thay vì filter từ list
    const response = await sendRequest(`/api/homestays/${homestayId}`, {
      method: "GET",
    });

    // Backend trả về HomestayDTO
    const dto: HomestayDTO = response?.data;

    if (!dto) {
      throw new Error("Homestay not found");
    }

    // Transform response sang frontend format
    const homestay: Homestay = {
      id: dto.id,
      name: dto.name,
      address: dto.address,
      city: dto.city,
      description: dto.description,
      pricePerNight: Number(dto.basePrice),
      capacity: dto.capacity,
      numBedrooms: dto.numRooms,
      numBathrooms: dto.bathroomCount,
      amenities: dto.amenities ? JSON.parse(dto.amenities) : [], // Parse amenities JSON string
      images: dto.images.map((img) => img.url),
      status: mapBackendStatus(dto.status),
      userId: dto.userId,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };

    return homestay;
  } catch (error: any) {
    // Handle errors và throw với message rõ ràng
    const errorMessage = error?.response?.data?.message || error.message || "Không thể tải thông tin homestay";
    throw new Error(errorMessage);
  }
};

/**
 * Tạo homestay mới
 * @param payload - CreateHomestayPayload với thông tin homestay và images
 * @returns Promise<HomestayDTO> - Homestay vừa tạo từ backend
 * @throws Error nếu user chưa đăng nhập hoặc validation thất bại
 */
export const createHomestay = async (payload: CreateHomestayPayload): Promise<HomestayDTO> => {
  // Lấy userId từ Redux store và thêm vào payload
  const userId = store.getState().auth.currentUser.userId;
  
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    // Gọi API POST /api/homestays với full payload
    const response = await sendRequest("/api/homestays", {
      method: "POST",
      payload: {
        ...payload,
        userId, // Thêm userId vào payload
      },
    });

    // Return HomestayDTO từ response
    return response?.data;
  } catch (error: any) {
    // Handle validation errors từ backend
    const errorMessage = error?.response?.data?.message || error.message || "Không thể tạo homestay";
    throw new Error(errorMessage);
  }
};

export const updateHomestay = (homestayId: number, payload: HomestayPayload) =>
  sendRequest(`/homestays/${homestayId}`, {
    method: "PUT",
    payload,
  });

/**
 * Gửi yêu cầu cập nhật homestay (tạo pending update request)
 * @param homestayId - ID của homestay cần cập nhật
 * @param payload - UpdateHomestayPayload với thông tin cập nhật
 * @returns Promise<HomestayPendingDTO> - Pending request vừa tạo
 * @throws Error nếu user chưa đăng nhập hoặc API call thất bại
 */
export const requestUpdateHomestay = async (
  homestayId: number,
  payload: UpdateHomestayPayload
): Promise<HomestayPendingDTO> => {
  // Lấy userId từ Redux store
  const userId = store.getState().auth.currentUser.userId;
  
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    // Gọi API POST /api/homestays/{id}/update-request?userId={userId}
    const response = await sendRequest(
      `/api/homestays/${homestayId}/update-request?userId=${userId}`,
      {
        method: "POST",
        payload,
      }
    );

    // Return HomestayPendingDTO từ response
    return response?.data;
  } catch (error: any) {
    // Handle errors và throw với message rõ ràng
    const errorMessage = error?.response?.data?.message || error.message || "Không thể gửi yêu cầu cập nhật";
    throw new Error(errorMessage);
  }
};

export const deleteHomestay = (homestayId: number) =>
  sendRequest(`/homestays/${homestayId}`, {
    method: "DELETE",
  });

/**
 * Toggle homestay status giữa công khai (2) và tạm ẩn (3)
 * @param homestayId - ID của homestay
 * @param currentStatus - Status hiện tại
 * @returns Promise<HomestayDTO> - Homestay đã cập nhật
 */
export const toggleHomestayStatus = async (homestayId: number, currentStatus: string): Promise<HomestayDTO> => {
  const userId = store.getState().auth.currentUser.userId;
  
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Toggle: approved (2) <-> hidden (3)
  const newStatus = currentStatus === "approved" ? 3 : 2;

  try {
    const response = await sendRequest(
      `/api/homestays/${homestayId}/status?userId=${userId}`,
      {
        method: "PATCH",
        payload: { status: newStatus },
      }
    );

    return response?.data;
  } catch (error: any) {
    const errorMessage = error?.message || "Không thể cập nhật trạng thái homestay";
    throw new Error(errorMessage);
  }
};

/**
 * Fetch homestays của host hiện tại
 * @returns Promise<Homestay[]> - Danh sách homestay đã transform sang frontend format
 * @throws Error nếu user chưa đăng nhập hoặc API call thất bại
 */
export const fetchMyHomestays = async (): Promise<Homestay[]> => {
  // Lấy userId từ Redux store
  const userId = store.getState().auth.currentUser.userId;
  
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Gọi API GET /api/homestays/mine?userId={userId}
  const response = await sendRequest(`/api/homestays/mine?userId=${userId}`, {
    method: "GET",
  });

  // Backend trả về { success, message, data: HomestayDTO[] }
  const homestaysDTO: HomestayDTO[] = response?.data ?? [];

  // Transform backend response sang frontend format
  const homestays: Homestay[] = homestaysDTO.map((dto) => {
    return {
      id: dto.id,
      name: dto.name,
      address: dto.address,
      city: dto.city,
      description: dto.description,
      pricePerNight: Number(dto.basePrice),
      capacity: dto.capacity,
      numBedrooms: dto.numRooms,
      numBathrooms: dto.bathroomCount,
      amenities: dto.amenities ? JSON.parse(dto.amenities) : [],
      images: dto.images.map((img) => img.url),
      status: mapBackendStatus(dto.status),
      userId: dto.userId,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      isUpdate: false, // TODO: Backend cần trả về field này từ homestay_pending
    };
  });

  return homestays;
};
