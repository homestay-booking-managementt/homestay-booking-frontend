// import { fetchHomestays } from "@/api/homestayApi";
// import type { Homestay, HomestayFilters } from "@/types/homestay";
// import { showAlert } from "@/utils/showAlert";
// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";

// interface FilterFormState {
//   city: string;
//   capacity: string;
//   checkIn: string;
//   checkOut: string;
// }

// const defaultFilters: FilterFormState = {
//   city: "",
//   capacity: "",
//   checkIn: "",
//   checkOut: "",
// };

// const HomestayListPage = () => {
//   const [filters, setFilters] = useState<FilterFormState>(defaultFilters);
//   const [loading, setLoading] = useState(false);
//   const [homestays, setHomestays] = useState<Homestay[]>([]);

//   const sanitizedFilters = useMemo(() => {
//     const result: HomestayFilters = {};

//     if (filters.city.trim()) {
//       result.city = filters.city.trim();
//     }

//     if (filters.capacity) {
//       const value = Number(filters.capacity);
//       if (!Number.isNaN(value)) {
//         result.capacity = value;
//       }
//     }

//     if (filters.checkIn) {
//       result.checkIn = filters.checkIn;
//     }

//     if (filters.checkOut) {
//       result.checkOut = filters.checkOut;
//     }

//     return result;
//   }, [filters]);

//   const handleFiltersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const loadHomestays = async (query?: HomestayFilters) => {
//     setLoading(true);
//     try {
//       const data = await fetchHomestays(query);
//       console.log(data);
//       setHomestays(Array.isArray(data) ? data : []);
//     } catch (error) {
//       showAlert("Unable to load homestay list", "danger");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     loadHomestays(sanitizedFilters);
//   };

//   const handleReset = () => {
//     setFilters(defaultFilters);
//     loadHomestays();
//   };

//   useEffect(() => {
//     loadHomestays();
//   }, []);

//   const formatCurrency = (value: number | undefined) => {
//     if (value === undefined || Number.isNaN(value)) {
//       return "--";
//     }

//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//       maximumFractionDigits: 0,
//     }).format(value);
//   };

//   return (
//     <div className="container">
//       <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
//         <div>
//           <h1 className="h3 mb-1">Homestay Listings</h1>
//           <p className="text-muted mb-0">
//             Browse and manage every homestay currently available in the system.
//           </p>
//         </div>
//         <Link className="btn btn-primary mt-3 mt-md-0" to="/homestays/new">
//           + Add Homestay
//         </Link>
//       </div>

//       <form className="row g-3" onSubmit={handleSubmit}>
//         <div className="col-md-3">
//           <label className="form-label" htmlFor="city">
//             City
//           </label>
//           <input
//             className="form-control"
//             id="city"
//             name="city"
//             placeholder="e.g. Da Nang"
//             value={filters.city}
//             onChange={handleFiltersChange}
//           />
//         </div>
//         <div className="col-md-3">
//           <label className="form-label" htmlFor="capacity">
//             Minimum capacity
//           </label>
//           <input
//             className="form-control"
//             id="capacity"
//             name="capacity"
//             type="number"
//             min={1}
//             value={filters.capacity}
//             onChange={handleFiltersChange}
//           />
//         </div>
//         <div className="col-md-3">
//           <label className="form-label" htmlFor="checkIn">
//             Check-in date
//           </label>
//           <input
//             className="form-control"
//             id="checkIn"
//             name="checkIn"
//             type="date"
//             value={filters.checkIn}
//             onChange={handleFiltersChange}
//           />
//         </div>
//         <div className="col-md-3">
//           <label className="form-label" htmlFor="checkOut">
//             Check-out date
//           </label>
//           <input
//             className="form-control"
//             id="checkOut"
//             name="checkOut"
//             type="date"
//             value={filters.checkOut}
//             onChange={handleFiltersChange}
//           />
//         </div>
//         <div className="col-12 d-flex gap-2">
//           <button className="btn btn-primary" disabled={loading} type="submit">
//             {loading ? "Searching..." : "Search"}
//           </button>
//           <button
//             className="btn btn-outline-secondary"
//             onClick={handleReset}
//             type="button"
//             disabled={loading}
//           >
//             Clear filters
//           </button>
//         </div>
//       </form>

//       <div className="mt-4">
//         {loading ? (
//           <div className="text-center py-5">Loading data...</div>
//         ) : homestays.length === 0 ? (
//           <div className="alert alert-info">No homestays match your filters yet.</div>
//         ) : (
//           <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
//             {homestays.map((homestay) => (
//               <div className="col" key={homestay.id}>
//                 <div className="card h-100 shadow-sm">
//                   {homestay.images && homestay.images.length > 0 ? (
//                     <img
//                       alt={homestay.name}
//                       className="card-img-top"
//                       height={200}
//                       src={homestay.images[0]}
//                       style={{ objectFit: "cover" }}
//                     />
//                   ) : (
//                     <div
//                       className="card-img-top bg-light d-flex align-items-center justify-content-center"
//                       style={{ height: 200 }}
//                     >
//                       <span className="text-muted">No image available</span>
//                     </div>
//                   )}
//                   <div className="card-body d-flex flex-column">
//                     <h5 className="card-title">{homestay.name}</h5>
//                     <p className="text-muted mb-2">
//                       {homestay.address}, {homestay.city}
//                     </p>
//                     <p className="mb-2">Price: {formatCurrency(homestay.pricePerNight)}</p>
//                     <p className="mb-3">Capacity: {homestay.capacity} guests</p>
//                     {homestay.description && (
//                       <p className="text-muted small flex-grow-1">
//                         {homestay.description.length > 140
//                           ? `${homestay.description.slice(0, 140)}...`
//                           : homestay.description}
//                       </p>
//                     )}
//                     <div className="mt-3">
//                       <Link
//                         className="btn btn-outline-primary w-100"
//                         to={`/homestays/${homestay.id}`}
//                       >
//                         View details
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HomestayListPage;

// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import { fetchHomestays } from "@/api/homestayApi";
// import type { Homestay, HomestayFilters } from "@/types/homestay";
// import { showAlert } from "@/utils/showAlert";

// interface FilterFormState {
//   city: string;
//   capacity: string;
//   checkIn: string;
//   checkOut: string;
// }

// const defaultFilters: FilterFormState = {
//   city: "",
//   capacity: "",
//   checkIn: "",
//   checkOut: "",
// };

// const HomestayListPage = () => {
//   const [filters, setFilters] = useState<FilterFormState>(defaultFilters);
//   const [loading, setLoading] = useState(false);
//   const [homestays, setHomestays] = useState<Homestay[]>([]);

//   // Chuẩn hóa filters (loại bỏ giá trị rỗng)
//   const sanitizedFilters = useMemo(() => {
//     const result: HomestayFilters = {};
//     if (filters.city.trim()) result.city = filters.city.trim();
//     if (filters.capacity && !Number.isNaN(Number(filters.capacity))) {
//       result.capacity = Number(filters.capacity);
//     }
//     if (filters.checkIn) result.checkIn = filters.checkIn;
//     if (filters.checkOut) result.checkOut = filters.checkOut;
//     return result;
//   }, [filters]);

//   const handleFiltersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   // Load homestays từ mock API
//   const loadHomestays = async (query?: HomestayFilters) => {
//     setLoading(true);
//     try {
//       const data = await fetchHomestays(query);
//       setHomestays(Array.isArray(data) ? data : []);
//     } catch {
//       showAlert("Không thể tải danh sách homestay", "danger");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     loadHomestays(sanitizedFilters);
//   };

//   const handleReset = () => {
//     setFilters(defaultFilters);
//     loadHomestays();
//   };

//   useEffect(() => {
//     loadHomestays();
//   }, []);

//   const formatCurrency = (value: number | undefined) =>
//     value
//       ? new Intl.NumberFormat("vi-VN", {
//           style: "currency",
//           currency: "VND",
//           maximumFractionDigits: 0,
//         }).format(value)
//       : "--";

//   return (
//     <div className="container py-4">
//       {/* Header */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
//         <div>
//           <h1 className="h3 mb-1">Danh sách Homestay</h1>
//           <p className="text-muted mb-0">
//             Duyệt qua các homestay hiện có trong hệ thống.
//           </p>
//         </div>
//         <Link className="btn btn-primary mt-3 mt-md-0" to="/homestays/new">
//           + Thêm Homestay
//         </Link>
//       </div>

//       {/* Bộ lọc */}
//       <form className="row g-3" onSubmit={handleSubmit}>
//         <div className="col-md-3">
//           <label className="form-label" htmlFor="city">
//             Thành phố
//           </label>
//           <input
//             className="form-control"
//             id="city"
//             name="city"
//             placeholder="VD: Đà Lạt"
//             value={filters.city}
//             onChange={handleFiltersChange}
//           />
//         </div>
//         <div className="col-md-3">
//           <label className="form-label" htmlFor="capacity">
//             Sức chứa tối thiểu
//           </label>
//           <input
//             className="form-control"
//             id="capacity"
//             name="capacity"
//             type="number"
//             min={1}
//             value={filters.capacity}
//             onChange={handleFiltersChange}
//           />
//         </div>
//         <div className="col-md-3">
//           <label className="form-label" htmlFor="checkIn">
//             Ngày đến
//           </label>
//           <input
//             className="form-control"
//             id="checkIn"
//             name="checkIn"
//             type="date"
//             value={filters.checkIn}
//             onChange={handleFiltersChange}
//           />
//         </div>
//         <div className="col-md-3">
//           <label className="form-label" htmlFor="checkOut">
//             Ngày đi
//           </label>
//           <input
//             className="form-control"
//             id="checkOut"
//             name="checkOut"
//             type="date"
//             value={filters.checkOut}
//             onChange={handleFiltersChange}
//           />
//         </div>
//         <div className="col-12 d-flex gap-2">
//           <button className="btn btn-primary" disabled={loading} type="submit">
//             {loading ? "Đang tìm..." : "Tìm kiếm"}
//           </button>
//           <button
//             className="btn btn-outline-secondary"
//             type="button"
//             onClick={handleReset}
//             disabled={loading}
//           >
//             Xóa bộ lọc
//           </button>
//         </div>
//       </form>

//       {/* Danh sách Homestay */}
//       <div className="mt-4">
//         {loading ? (
//           <div className="text-center py-5">Đang tải dữ liệu...</div>
//         ) : homestays.length === 0 ? (
//           <div className="alert alert-info">
//             Không có homestay nào phù hợp với điều kiện tìm kiếm.
//           </div>
//         ) : (
//           <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
//             {homestays.map((homestay) => (
//               <div className="col" key={homestay.id}>
//                 <div className="card h-100 shadow-sm">
//                   {/* Ảnh chính */}
//                   {homestay.images?.[0]?.url ? (
//                     <img
//                       src={homestay.images[0].url}
//                       alt={homestay.name}
//                       className="card-img-top"
//                       height={220}
//                       style={{ objectFit: "cover" }}
//                     />
//                   ) : (
//                     <div
//                       className="bg-light d-flex align-items-center justify-content-center"
//                       style={{ height: 220 }}
//                     >
//                       <span className="text-muted">Chưa có ảnh</span>
//                     </div>
//                   )}

//                   {/* Thông tin chính */}
//                   <div className="card-body d-flex flex-column">
//                     <h5 className="card-title mb-2">{homestay.name}</h5>
//                     <p className="text-muted mb-1">
//                       <i className="bi bi-geo-alt me-1" />
//                       {homestay.address || "Địa chỉ không xác định"}
//                     </p>
//                     <p className="mb-1">
//                       <strong>Giá cơ bản:</strong>{" "}
//                       {formatCurrency(homestay.base_price)}
//                     </p>
//                     <p className="mb-1">
//                       <strong>Sức chứa:</strong> {homestay.capacity} khách
//                     </p>
//                     <p className="mb-1">
//                       <strong>Số phòng:</strong> {homestay.num_rooms || "--"}
//                     </p>
//                     <p className="mb-1">
//                       <strong>Xếp hạng:</strong>{" "}
//                       {homestay.rating ? `${homestay.rating} ★` : "Chưa có"}
//                     </p>

//                     {/* Mô tả */}
//                     {homestay.description && (
//                       <p className="text-muted small mt-2 flex-grow-1">
//                         {homestay.description.length > 140
//                           ? homestay.description.slice(0, 140) + "..."
//                           : homestay.description}
//                       </p>
//                     )}

//                     {/* Link xem chi tiết */}
//                     <div className="mt-3">
//                       <Link
//                         className="btn btn-outline-primary w-100"
//                         to={`/homestays/${homestay.id}`}
//                       >
//                         Xem chi tiết
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HomestayListPage;

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchHomestays } from "@/api/homestayApi";
import type { Homestay, HomestayFilters } from "@/types/homestay";
import { showAlert } from "@/utils/showAlert";
import FilterForm from "@/components/homestay/FilterForm";
import HomestayList from "@/components/homestay/HomestayList";

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

  // Chuẩn hóa filters
  const sanitizedFilters = useMemo(() => {
    const result: HomestayFilters = {};

    if (filters.city.trim()) {
      result.city = filters.city.trim();
    }

    if (filters.capacity) {
      const value = Number(filters.capacity);
      if (!Number.isNaN(value)) {
        result.capacity = value;
      }
    }

    if (filters.checkIn) {
      result.checkIn = filters.checkIn;
    }

    if (filters.checkOut) {
      result.checkOut = filters.checkOut;
    }

    return result;
  }, [filters]);

  const loadHomestays = async (query?: HomestayFilters) => {
    setLoading(true);
    try {
      const data = await fetchHomestays(query);
      setHomestays(Array.isArray(data) ? data : []);
    } catch (error) {
      showAlert("Unable to load homestay list", "danger");
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

  return (
    <div className="container">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
        <div>
          <h1 className="h3 mb-1">Homestay Listings</h1>
          <p className="text-muted mb-0">Browse and manage every homestay currently available in the system.</p>
        </div>
        <Link className="btn btn-primary mt-3 mt-md-0" to="/homestays/new">
          + Add Homestay
        </Link>
      </div>

      {/* Bộ lọc */}
      <FilterForm
        filters={filters}
        loading={loading}
        onChange={setFilters}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />

      {/* Danh sách */}
      <HomestayList loading={loading} homestays={homestays} />
    </div>
  );
};

export default HomestayListPage;
