import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchHomestays } from "@/api/homestayApi";
import type { Homestay, HomestayFilters } from "@/types/homestay";
import { showAlert } from "@/utils/showAlert";

interface FilterFormState {
  city: string;
  capacity: string;
  checkIn: string;
  checkOut: string;
}

const defaultFilters: FilterFormState = {
  city: "",
  capacity: "",
  checkIn: "",
  checkOut: "",
};

const HomestayListPage = () => {
  const [filters, setFilters] = useState<FilterFormState>(defaultFilters);
  const [loading, setLoading] = useState(false);
  const [homestays, setHomestays] = useState<Homestay[]>([]);

  // Chuẩn hóa filters (loại bỏ giá trị rỗng)
  const sanitizedFilters = useMemo(() => {
    const result: HomestayFilters = {};
    if (filters.city.trim()) result.city = filters.city.trim();
    if (filters.capacity && !Number.isNaN(Number(filters.capacity))) {
      result.capacity = Number(filters.capacity);
    }
    if (filters.checkIn) result.checkIn = filters.checkIn;
    if (filters.checkOut) result.checkOut = filters.checkOut;
    return result;
  }, [filters]);

  const handleFiltersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Load homestays từ mock API
  const loadHomestays = async (query?: HomestayFilters) => {
    setLoading(true);
    try {
      const data = await fetchHomestays(query);
      setHomestays(Array.isArray(data) ? data : []);
    } catch {
      showAlert("Không thể tải danh sách homestay", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loadHomestays(sanitizedFilters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    loadHomestays();
  };

  useEffect(() => {
    loadHomestays();
  }, []);

  const formatCurrency = (value: number | undefined) =>
    value
      ? new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(value)
      : "--";

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h1 className="h3 mb-1">Danh sách Homestay</h1>
          <p className="text-muted mb-0">
            Duyệt qua các homestay hiện có trong hệ thống.
          </p>
        </div>
      </div>

      {/* Bộ lọc */}
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <label className="form-label" htmlFor="city">
            Thành phố
          </label>
          <input
            className="form-control"
            id="city"
            name="city"
            placeholder="VD: Đà Lạt"
            value={filters.city}
            onChange={handleFiltersChange}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label" htmlFor="capacity">
            Sức chứa tối thiểu
          </label>
          <input
            className="form-control"
            id="capacity"
            name="capacity"
            type="number"
            min={1}
            value={filters.capacity}
            onChange={handleFiltersChange}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label" htmlFor="checkIn">
            Ngày đến
          </label>
          <input
            className="form-control"
            id="checkIn"
            name="checkIn"
            type="date"
            value={filters.checkIn}
            onChange={handleFiltersChange}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label" htmlFor="checkOut">
            Ngày đi
          </label>
          <input
            className="form-control"
            id="checkOut"
            name="checkOut"
            type="date"
            value={filters.checkOut}
            onChange={handleFiltersChange}
          />
        </div>
        <div className="col-12 d-flex gap-2">
          <button className="btn btn-primary" disabled={loading} type="submit">
            {loading ? "Đang tìm..." : "Tìm kiếm"}
          </button>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={handleReset}
            disabled={loading}
          >
            Xóa bộ lọc
          </button>
        </div>
      </form>

      {/* Danh sách Homestay */}
      <div className="mt-4">
        {loading ? (
          <div className="text-center py-5">Đang tải dữ liệu...</div>
        ) : homestays.length === 0 ? (
          <div className="alert alert-info">
            Không có homestay nào phù hợp với điều kiện tìm kiếm.
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
            {homestays.map((homestay) => (
              <div className="col" key={homestay.id}>
                <div className="card h-100 shadow-sm">
                  {/* Ảnh chính */}
                  {homestay.images?.[0]?.url ? (
                    <img
                      src={homestay.images[0].url}
                      alt={homestay.name}
                      className="card-img-top"
                      height={220}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="bg-light d-flex align-items-center justify-content-center"
                      style={{ height: 220 }}
                    >
                      <span className="text-muted">Chưa có ảnh</span>
                    </div>
                  )}

                  {/* Thông tin chính */}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-2">{homestay.name}</h5>
                    <p className="text-muted mb-1">
                      <i className="bi bi-geo-alt me-1" />
                      {homestay.address || "Địa chỉ không xác định"}
                    </p>
                    <p className="mb-1">
                      <strong>Giá cơ bản:</strong>{" "}
                      {formatCurrency(homestay.basePrice)}
                    </p>
                    <p className="mb-1">
                      <strong>Sức chứa:</strong> {homestay.capacity} khách
                    </p>
                    <p className="mb-1">
                      <strong>Số phòng:</strong> {homestay.numRooms || "--"}
                    </p>
                    <p className="mb-1">
                      <strong>Xếp hạng:</strong>{" "}
                      {homestay.rating ? `${homestay.rating} ★` : "Chưa có"}
                    </p>

                    {/* Mô tả */}
                    {homestay.description && (
                      <p className="text-muted small mt-2 flex-grow-1">
                        {homestay.description.length > 140
                          ? homestay.description.slice(0, 140) + "..."
                          : homestay.description}
                      </p>
                    )}

                    <div className="row d-flex flex-row gap-2">
                      <Link
                        className="btn btn-outline-primary w-100"
                        to={`/homestays/${homestay.id}`}
                      >
                        Xem chi tiết
                      </Link>
                      <Link
                        className="btn btn-outline-primary w-100"
                        to={`/bookings?homestayId=${homestay.id}${
                          filters.checkIn ? `&checkIn=${filters.checkIn}` : ""
                        }${filters.checkOut ? `&checkOut=${filters.checkOut}` : ""}`}
                      >
                        Đặt phòng
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomestayListPage;
