import { deleteHomestay, fetchHomestayById } from "@/api/homestayApi";
import type { Homestay } from "@/types/homestay";
import { showAlert } from "@/utils/showAlert";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "@/styles/HomestayDetailPage.css";

import HomestayHeader from "@/components/homestay/HomestayHeader";
import HomestayImageCarousel from "@/components/homestay/HomestayImageCarousel";
import HomestayInfoCard from "@/components/homestay/HomestayInfoCard";
import HostInfoCard from "@/components/homestay/HostInfoCard";

const HomestayDetailPage = () => {
  const navigate = useNavigate();
  const { homestayId } = useParams<{ homestayId: string }>();
  const [homestay, setHomestay] = useState<Homestay | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const loadHomestay = async (id: number) => {
    setLoading(true);
    try {
      const data = await fetchHomestayById(id);
      setHomestay(data);
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

  const handleDelete = async () => {
    if (!homestayId) return;
    const id = Number(homestayId);
    if (Number.isNaN(id)) {
      showAlert("ID homestay không hợp lệ", "warning");
      return;
    }
    const confirmed = window.confirm("Xác nhận xóa homestay này?");
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteHomestay(id);
      showAlert("Đã xóa homestay thành công", "success");
      navigate("/homestays");
    } catch {
      showAlert("Xóa homestay thất bại", "danger");
    } finally {
      setDeleting(false);
    }
  };

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

  return (
    <div className="container">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
        <div>
          <h1 className="h3 mb-1">{homestay.name}</h1>
          <p className="text-muted mb-0">
            {homestay.address}
          </p>
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <Link className="btn btn-outline-primary" to={`/homestays/${homestay.id}/edit`}>
            Edit
          </Link>
          <button
            className="btn btn-danger"
            disabled={deleting}
            onClick={handleDelete}
            type="button"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {homestay.images && homestay.images.length > 0 && (
        <div className="row g-3 mb-4">
          {homestay.images.map((img) => (
            <div className="col-12 col-md-6 col-xl-4" key={img.id}>
              <div className="ratio ratio-16x9">
                <img
                  alt={img.alt || `Image ${img.id}`}
                  className="rounded shadow-sm"
                  src={img.url}
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          ))}
        </div>
      )}


      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h5 className="card-title">Overview</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item px-0 d-flex justify-content-between">
                  <span>Price per night</span>
                  <strong>{formatCurrency(homestay.base_price)}</strong>
                </li>
                <li className="list-group-item px-0 d-flex justify-content-between">
                  <span>Capacity</span>
                  <strong>{homestay.capacity} guests</strong>
                </li>
                <li className="list-group-item px-0 d-flex justify-content-between">
                  <span>Bathroom</span>
                  <strong>{homestay.bathroom_count ?? "--"}</strong>
                </li>
                <li className="list-group-item px-0 d-flex justify-content-between">
                  <span>Numroom</span>
                  <strong>{homestay.num_rooms ?? "--"}</strong>
                </li>
                {homestay.status && (
                  <li className="list-group-item px-0 d-flex justify-content-between">
                    <span>Status</span>
                    <span className="badge bg-secondary text-uppercase">{homestay.status}</span>
                  </li>
                )}
              </ul>
            </div>
            <div className="col-md-6">
              <h5 className="card-title">Amenities</h5>
              {homestay.amenities && homestay.amenities.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {homestay.amenities.map((amenity) => (
                    <span className="badge bg-light text-dark border" key={amenity}>
                      {amenity}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted">Amenities not provided yet.</p>
              )}
            </div>
          </div>

          {homestay.description && (
            <div className="mt-4">
              <h5>Description</h5>
              <p className="mb-0">{homestay.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomestayDetailPage;
