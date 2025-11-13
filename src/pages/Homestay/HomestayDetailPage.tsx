import { fetchHomestayById } from "@/api/homestayApi";
import type { Homestay } from "@/types/homestay";
import { showAlert } from "@/utils/showAlert";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "@/styles/HomestayDetailPage.css";


const HomestayDetailPage = () => {
  const navigate = useNavigate();
  const { homestayId } = useParams<{ homestayId: string }>();
  const [homestay, setHomestay] = useState<Homestay | null>(null);
  const [loading, setLoading] = useState(true);

  const loadHomestay = async (id: number) => {
    setLoading(true);
    try {
      const data = await fetchHomestayById(id);
      if(data) setHomestay(data);
    } catch {
      showAlert("Không thể tải chi tiết homestay", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (homestayId) {
      const id = Number(homestayId);
      if (Number.isNaN(id)) {
        showAlert("ID homestay không hợp lệ", "warning");
        navigate("/homestays");
        return;
      }
      loadHomestay(id);
    }
  }, [homestayId, navigate]);


  const formatCurrency = (value: number | undefined) =>
    value
      ? new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(value)
      : "--";

  if (loading)
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-muted">Đang tải thông tin homestay...</p>
      </div>
    );

  if (!homestay)
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning mt-4">Không tìm thấy thông tin homestay.</div>
        <Link className="btn btn-outline-primary mt-3" to="/homestays">
          ← Quay lại danh sách
        </Link>
      </div>
    );
    const amenitiesObj: Record<string, boolean> =
  typeof homestay?.amenities === "string"
    ? JSON.parse(homestay.amenities)
    : {};


  return (
    // <div className="container">
    //   <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
    //     <div>
    //       <h1 className="h3 mb-1">{homestay.name}</h1>
    //       <p className="text-muted mb-0">
    //         {homestay.address}
    //       </p>
    //     </div>
    //   </div>

    //   {homestay.images && homestay.images.length > 0 && (
    //     <div className="row g-3 mb-4">
    //       {homestay.images.map((img) => (
    //         <div className="col-12 col-md-6 col-xl-4" key={img.id}>
    //           <div className="ratio ratio-16x9">
    //             <img
    //               alt={img.alt || `Image ${img.id}`}   // ảnh nào -> alt nấy
    //               src={img.url}                        // ảnh nào -> url nấy
    //               className="rounded shadow-sm"
    //               style={{ objectFit: "cover" }}
    //             />
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   )}


    //   <div className="card shadow-sm">
    //     <div className="card-body">
    //       <div className="row">
    //         <div className="col-md-6">
    //           <h5 className="card-title">Overview</h5>
    //           <ul className="list-group list-group-flush">
    //             <li className="list-group-item px-0 d-flex justify-content-between">
    //               <span>Price per night</span>
    //               <strong>{formatCurrency(homestay.basePrice)}</strong>
    //             </li>
    //             <li className="list-group-item px-0 d-flex justify-content-between">
    //               <span>Capacity</span>
    //               <strong>{homestay.capacity} guests</strong>
    //             </li>
    //             <li className="list-group-item px-0 d-flex justify-content-between">
    //               <span>Bedroom</span>
    //               <strong>{homestay.bathroomCount ?? "--"}</strong>
    //             </li>
    //             <li className="list-group-item px-0 d-flex justify-content-between">
    //               <span>Numroom</span>
    //               <strong>{homestay.numRooms ?? "--"}</strong>
    //             </li>
    //             {homestay.status && (
    //               <li className="list-group-item px-0 d-flex justify-content-between">
    //                 <span>Status</span>
    //                 <span className="badge bg-secondary text-uppercase">{homestay.status}</span>
    //               </li>
    //             )}
    //           </ul>
    //         </div>
            
    //       </div>

    //       {homestay.description && (
    //         <div className="mt-4">
    //           <h5>Description</h5>
    //           <p className="mb-0">{homestay.description}</p>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </div>
    <div className="container py-4" style={{ maxWidth: 900 }}>
  {/* HEADER */}
  <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
    <div>
      <h1 className="h3 fw-bold mb-1 text-purple">{homestay.name}</h1>
      <p className="text-muted mb-0 d-flex align-items-center">
        <i className="bi bi-geo-alt-fill me-1 text-purple"></i>
        {homestay.address}, {homestay.city}
      </p>
    </div>
  </div>

  {/* IMAGE GALLERY */}
    <div className="row g-3 mb-4">
      {homestay.images?.map((img) => (
        <div className="col-12 col-md-6 col-xl-4" key={img.id}>
          <div className="ratio ratio-16x9 border rounded-3 shadow-sm overflow-hidden">
            <img
              alt={img.alt || `Image ${img.id}`}
              src={img.url}
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      ))}
    </div>
  

  {/* MAIN CARD */}
  <div className="card shadow-sm border-0 rounded-4">
    <div className="card-body">

      {/* OVERVIEW */}
      <h5 className="fw-bold mb-3">
        <i className="bi bi-info-circle me-2 text-purple"></i>Thông tin chung
      </h5>

      <div className="row mb-3 g-3">
        <div className="col-md-6">
          <div className="p-3 rounded-3 border bg-light">
            <div className="d-flex justify-content-between">
              <span>💵 Giá mỗi đêm</span>
              <strong className="text-success">{formatCurrency(homestay.basePrice)}</strong>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="p-3 rounded-3 border bg-light">
            <div className="d-flex justify-content-between">
              <span>👥 Sức chứa</span>
              <strong>{homestay.capacity} khách</strong>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="p-3 rounded-3 border bg-light">
            <div className="d-flex justify-content-between">
              <span>🛏️ Số phòng ngủ</span>
              <strong>{homestay.numRooms ?? "--"}</strong>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="p-3 rounded-3 border bg-light">
            <div className="d-flex justify-content-between">
              <span>🚿 Phòng tắm</span>
              <strong>{homestay.bathroomCount ?? "--"}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      {homestay.description && (
        <div className="mt-4">
          <h5 className="fw-bold mb-2">
            <i className="bi bi-text-paragraph me-2 text-purple"></i>Mô tả
          </h5>
          <p className="text-muted">{homestay.description}</p>
        </div>
      )}

      {/* AMENITIES */}
      {homestay.amenities && (
        <div className="mt-4">
          <h5 className="fw-bold mb-2">
            <i className="bi bi-stars me-2 text-purple"></i>Tiện nghi
          </h5>

          <div className="d-flex flex-wrap gap-2">
  {Object.entries(amenitiesObj).map(([key, value]) =>
    value ? (
      <span key={key} className="badge bg-light text-dark border px-3 py-2 rounded-pill">
        ✔ {key.replace("_", " ")}
      </span>
    ) : null
  )}
</div>

        </div>
      )}

    </div>
  </div>
</div>

  );
};

export default HomestayDetailPage;
