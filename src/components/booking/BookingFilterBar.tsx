import "@/styles/BookingFilter.css";

interface BookingFilterProps {
  q: string;
  setQ: (v: string) => void;
  from: string;
  setFrom: (v: string) => void;
  to: string;
  setTo: (v: string) => void;
  sortBy: "createdAt_desc" | "createdAt_asc";
  setSortBy: (v: "createdAt_desc" | "createdAt_asc") => void;
  onClear: () => void;
}

export const BookingFilter: React.FC<BookingFilterProps> = ({
  q,
  setQ,
  from,
  setFrom,
  to,
  setTo,
  sortBy,
  setSortBy,
  onClear,
}) => {
  return (
    <div className="filter-bar filter-bar-light mb-4 p-3 rounded shadow-sm ">
      <div className="row g-3 align-items-end ">
        {/* Ô tìm kiếm */}
        <div className="col-12 col-md-4">
          <label className="form-label fw-semibold text-purple">Tìm theo tên homestay</label>
          <div className="input-group">
            <span className="input-group-text bg-purple text-white">
              <i className="bi bi-search" />
            </span>
            <input
              className="form-control border-purple"
              placeholder="Nhập từ khóa..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ transition: "border-color 0.3s" }}
              onFocus={(e) => e.currentTarget.classList.add("border-purple-focus")}
              onBlur={(e) => e.currentTarget.classList.remove("border-purple-focus")}
            />
          </div>
        </div>

        {/* Ô ngày check-in */}
        <div className="col-6 col-md-3">
          <label className="form-label fw-semibold text-purple">Check-in từ</label>
          <input
            type="date"
            className="form-control border-purple"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        {/* Ô ngày check-out */}
        <div className="col-6 col-md-3">
          <label className="form-label fw-semibold text-purple">Check-out đến</label>
          <input
            type="date"
            className="form-control border-purple"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        {/* Sắp xếp */}
        <div className="col-12 col-md-2">
          <label className="form-label fw-semibold text-purple">Sắp xếp</label>
          <select
            className="form-select border-purple"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="createdAt_desc">Mới nhất</option>
            <option value="createdAt_asc">Cũ nhất</option>
          </select>
        </div>

        {/* Nút xóa bộ lọc */}
        <div className="col-12 d-flex gap-2 justify-content-end mt-2">
          <button type="button" className="btn btn-outline-purple" onClick={onClear}>
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
};
