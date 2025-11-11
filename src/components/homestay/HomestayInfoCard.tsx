import type { Homestay } from "@/types/homestay";

interface Props {
  homestay: Homestay;
}

const HomestayInfoCard = ({ homestay }: Props) => {
  return (
    <div className="card shadow-sm mb-4 homestay-detail-card">
      <div className="card-body">
        <div className="row">
          <div className="col-md-6 mb-3">
            <h5 className="card-title">Chi tiết Homestay</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item px-0 d-flex justify-content-between">
                <span>Số phòng</span>
                <strong>{homestay.num_rooms ?? "--"}</strong>
              </li>
              <li className="list-group-item px-0 d-flex justify-content-between">
                <span>Phòng tắm</span>
                <strong>{homestay.bathroom_count ?? "--"}</strong>
              </li>
              <li className="list-group-item px-0 d-flex justify-content-between">
                <span>Trạng thái</span>
                <span className="badge bg-success text-uppercase">
                  {homestay.status === 1 ? "Hoạt động" : "Ẩn"}
                </span>
              </li>
              <li className="list-group-item px-0 d-flex justify-content-between">
                <span>Ngày tạo</span>
                <strong>{new Date(homestay.created_at).toLocaleDateString()}</strong>
              </li>
              {homestay.approved_at && (
                <li className="list-group-item px-0 d-flex justify-content-between">
                  <span>Ngày duyệt</span>
                  <strong>{new Date(homestay.approved_at).toLocaleDateString()}</strong>
                </li>
              )}
            </ul>
          </div>

          <div className="col-md-6 mb-3">
            <h5 className="card-title">Tiện nghi</h5>
            {homestay.amenities && homestay.amenities.length > 0 ? (
              <div className="d-flex flex-wrap gap-2">
                {homestay.amenities.map((amenity) => (
                  <span key={amenity} className="badge bg-light text-dark border">
                    {amenity}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted">Chưa có tiện nghi được thêm</p>
            )}
          </div>
        </div>

        {homestay.description && (
          <div className="mt-4">
            <h5>Mô tả</h5>
            <p className="mb-0 text-muted">{homestay.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomestayInfoCard;
