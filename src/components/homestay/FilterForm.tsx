interface FilterFormProps {
  filters: {
    city: string;
    capacity: string;
    checkIn: string;
    checkOut: string;
  };
  loading: boolean;
  onChange: (filters: any) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
}

const FilterForm: React.FC<FilterFormProps> = ({
  filters,
  loading,
  onChange,
  onSubmit,
  onReset,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    onChange((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="row g-3" onSubmit={onSubmit}>
      <div className="col-md-3">
        <label className="form-label" htmlFor="city">Thành phố</label>
        <input
          className="form-control"
          id="city"
          name="city"
          placeholder="VD: Đà Lạt"
          value={filters.city}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-3">
        <label className="form-label" htmlFor="capacity">Sức chứa tối thiểu</label>
        <input
          className="form-control"
          id="capacity"
          name="capacity"
          type="number"
          min={1}
          value={filters.capacity}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-3">
        <label className="form-label" htmlFor="checkIn">Ngày đến</label>
        <input
          className="form-control"
          id="checkIn"
          name="checkIn"
          type="date"
          value={filters.checkIn}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-3">
        <label className="form-label" htmlFor="checkOut">Ngày đi</label>
        <input
          className="form-control"
          id="checkOut"
          name="checkOut"
          type="date"
          value={filters.checkOut}
          onChange={handleChange}
        />
      </div>

      <div className="col-12 d-flex gap-2">
        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={onReset}
          disabled={loading}
        >
          Xóa bộ lọc
        </button>
      </div>
    </form>
  );
};

export default FilterForm;
