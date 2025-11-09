
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
    <div className="container py-4">
      <HomestayHeader homestay={homestay} formatCurrency={formatCurrency} />
      <HomestayImageCarousel images={homestay.images} />

      <div className="row">
        <div className="col-lg-8">
          <HomestayInfoCard homestay={homestay} />
        </div>
        <div className="col-lg-4">
          <HostInfoCard host={homestay.host} />
        </div>
      </div>

      <div className="d-flex gap-2 mt-4">
        <Link
          className="btn btn-outline-primary"
          to={`/homestays/${homestay.id}/edit`}
        >
          <i className="bi bi-pencil-square me-1" />
          Sửa thông tin
        </Link>
        <button
          className={`btn ${deleting ? "btn-secondary" : "btn-danger"}`}
          disabled={deleting}
          onClick={handleDelete}
          type="button"
        >
          <i className="bi bi-trash3 me-1" />
          {deleting ? "Đang xóa..." : "Xóa homestay"}
        </button>
        <Link className="btn btn-link ms-auto" to="/homestays">
          ← Quay lại danh sách
        </Link>
      </div>
    </div>
  );
};

export default HomestayDetailPage;
