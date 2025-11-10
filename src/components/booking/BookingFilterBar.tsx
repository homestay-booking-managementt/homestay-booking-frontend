import { BookingStatusPayload, STATUS_LABEL } from "@/types/booking";

interface BookingFilterAdvancedProps {
  q: string;
  setQ: (value: string) => void;
  status: "" | BookingStatusPayload['status'];
  setStatus: (value: "" | BookingStatusPayload['status']) => void;
  from: string;
  setFrom: (value: string) => void;
  to: string;
  setTo: (value: string) => void;
  onlyUpcoming: boolean;
  setOnlyUpcoming: (value: boolean) => void;
  sortBy: "checkIn_desc" | "checkIn_asc";
  setSortBy: (value: "checkIn_desc" | "checkIn_asc") => void;
  loading: boolean;
  onClear: () => void;
  onReload: () => void;
}

const ALL_STATUSES: BookingStatusPayload['status'][] = [
  "pending",
  "confirmed",
  "paid",
  "checked_in",
  "checked_out",
  "canceled",
  "refunded",
  "completed",
];

const BookingFilterAdvanced = ({
  q,
  setQ,
  status,
  setStatus,
  from,
  setFrom,
  to,
  setTo,
  onlyUpcoming,
  setOnlyUpcoming,
  sortBy,
  setSortBy,
  loading,
  onClear,
  onReload,
}: BookingFilterAdvancedProps) => {
  return (
    <>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Lịch sử đặt phòng</h1>
          <p className="text-muted mb-0">
            Xem lại các đặt phòng trước đây và sắp tới của anh.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={onClear}
            disabled={loading}
            title="Xóa bộ lọc"
          >
            Xóa lọc
          </button>
          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={onReload}
            type="button"
          >
            {loading ? "Đang tải..." : "Làm mới"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label">Tìm homestay</label>
              <input
                className="form-control"
                placeholder="Nhập tên homestay..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="col-6 col-md-3">
              <label className="form-label">Trạng thái</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as BookingStatusPayload['status'] | "")}
              >
                <option value="">Tất cả</option>
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label">Từ ngày</label>
              <input
                type="date"
                className="form-control"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label">Đến ngày</label>
              <input
                type="date"
                className="form-control"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <div className="col-6 col-md-1 d-flex align-items-end">
              <div className="form-check">
                <input
                  id="onlyUpcoming"
                  className="form-check-input"
                  type="checkbox"
                  checked={onlyUpcoming}
                  onChange={(e) => setOnlyUpcoming(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="onlyUpcoming">
                  Sắp tới
                </label>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label">Sắp xếp</label>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "checkIn_desc" | "checkIn_asc")}
              >
                <option value="checkIn_desc">Check-in mới → cũ</option>
                <option value="checkIn_asc">Check-in cũ → mới</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingFilterAdvanced;
