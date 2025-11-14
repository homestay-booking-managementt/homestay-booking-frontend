import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchHomestays } from "@/api/homestayApi";
import type { Homestay, HomestayFilters } from "@/types/homestay";
import { showAlert } from "@/utils/showAlert";
import AppDialog from "@/components/common/AppDialog";
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
  const navigate = useNavigate();
  const [dialog, setDialog] = useState({
  show: false,
  title: "",
  message: "",
  confirmText: "OK",
  cancelText: undefined as string | undefined,
  onConfirm: null as (() => void) | null,
});

  const [pendingHomestayId, setPendingHomestayId] = useState<number | null>(null);

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
      console.log("query",query);
      console.log(data);
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
  // const handleBookingClick = (id: number) => {
  //   if (!filters.checkIn || !filters.checkOut) {
  //     setDialog({
  //       show: true,
  //       title: "Thiếu thông tin ngày",
  //       message: "Bạn cần chọn ngày check-in và check-out trước khi đặt phòng.",
  //     });
  //     return;
  //   }

  //   navigate(`/bookings?homestayId=${id}&checkIn=${filters.checkIn}&checkOut=${filters.checkOut}`);
  // };
  const handleDetailClick =(id : number) =>{
    navigate(`/homestays/${id}`);
  }
  const handleBookingClick = (id: number) => {
    // 1. Thiếu ngày
    if (!filters.checkIn || !filters.checkOut) {
      setDialog({
        show: true,
        title: "Thiếu thông tin ngày",
        message: "Bạn cần chọn ngày check-in và check-out trước khi đặt phòng.",
        confirmText: "Đã hiểu",
    cancelText: undefined,
    onConfirm: null
      });
      return;
    }


  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkInDate = new Date(filters.checkIn);
  const checkOutDate = new Date(filters.checkOut);

  // 2. Kiểm tra date hợp lệ
  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    setDialog({
      show: true,
      title: "Ngày không hợp lệ",
      message: "Vui lòng chọn lại ngày check-in và check-out.",
      confirmText: "Đã hiểu",
  cancelText: undefined,
  onConfirm: null
    });
    return;
  }

  // 3. Không cho đặt quá khứ
  if (checkInDate < today) {
    setDialog({
      show: true,
      title: "Ngày check-in không hợp lệ",
      message: "Ngày đến không được nhỏ hơn ngày hiện tại.",
      confirmText: "Đã hiểu",
  cancelText: undefined,
  onConfirm: null
    });
    return;
  }

  // 4. Check-out phải sau check-in
  if (checkOutDate <= checkInDate) {
    setDialog({
      show: true,
      title: "Ngày không hợp lệ",
      message: "Ngày đi phải sau ngày đến.",
      confirmText: "Đã hiểu",
  cancelText: undefined,
  onConfirm: null
    });
    return;
  }

  // 5. Tính số đêm
  const nights = Math.floor(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // 6. Giới hạn năm (tối đa 1 năm)
  const maxFutureDate = new Date();
  maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 1);

  if (checkInDate > maxFutureDate ) {
    setDialog({
      show: true,
      title: "Ngày đặt quá xa",
      message: "Bạn chỉ có thể đặt phòng tối đa 1 năm kể từ hôm nay.",
      confirmText: "Đã hiểu",
  cancelText: undefined,
  onConfirm: null
    });
    return;
  }

  // ⭐ 7. Nếu ở > 10 ngày → yêu cầu xác nhận
  if (nights > 10) {
    setPendingHomestayId(id); // lưu id để dùng khi xác nhận
    setDialog({
      show: true,
  title: "Xác nhận đặt phòng dài ngày",
  message: `Bạn đang đặt ${nights} đêm. Bạn có chắc chắn muốn đặt không?`,
  confirmText: "Đồng ý",
  cancelText: "Hủy",
  onConfirm: () => {
    navigate(`/bookings?homestayId=${id}&checkIn=${filters.checkIn}&checkOut=${filters.checkOut}`);
  }
    });
    return;
  }

  // 8. Điều hướng bình thường
  navigate(`/bookings?homestayId=${id}&checkIn=${filters.checkIn}&checkOut=${filters.checkOut}`);
};

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h1 className="h3 mb-1">Danh sách Homestay</h1>
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
            placeholder="VD: Hà Nội"
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

                    {/* <div className="row d-flex flex-row gap-2">
                      <Link
                        className="btn btn-outline-primary w-100"
                        to={`/homestays/${homestay.id}`}
                      >
                        Xem chi tiết
                      </Link>
                      
                      <button
                        className="btn btn-outline-primary w-100"
                        type="button"
                        onClick={()=>{
                          handleBookingClick(homestay.id);
                        }}
                      >
                        Đặt phòng
                      </button>
                    </div> */}
                    {/* <div className="row g-2">
                      <div className="col-6">
                        <button
                          className="btn btn-outline-primary w-100 boder-2"
                          onClick={() => handleDetailClick(homestay.id)}
                        >
                          Xem chi tiết
                        </button>
                      </div>
                      <div className="col-6">
                        <button
                          className="btn btn-outline-primary w-100"
                          onClick={() => handleBookingClick(homestay.id)}
                        >
                          Đặt phòng
                        </button>
                      </div>
                    </div> */}
                    <div className="row g-2 justify-content-center">
  {/* Đặt phòng bên trái */}
  <div className="col-6 ">
    <button
      className="btn btn-outline-primary w-100 border-2 justify-content-center"
      onClick={() => handleBookingClick(homestay.id)}
    >
      Đặt phòng
    </button>
  </div>

  {/* Xem chi tiết bên phải */}
  <div className="col-6">
    <button
      className="btn btn-outline-primary w-100 border-2 justify-content-center"
      onClick={() => handleDetailClick(homestay.id)}
    >
      Xem chi tiết
    </button>
  </div>
</div>


                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
        <AppDialog
        show={dialog.show}
        title={dialog.title}
        message={dialog.message}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        onClose={() => setDialog((old) => ({ ...old, show: false }))}
        onConfirm={() => {
          if (dialog.onConfirm) dialog.onConfirm();
          setDialog((old) => ({ ...old, show: false }));
        }}
      />

    </div>
  );
};

export default HomestayListPage;
