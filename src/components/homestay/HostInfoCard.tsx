import type { Homestay } from "@/types/homestay";

interface Props {
  host: Homestay["host"];
}

const HostInfoCard = ({ host }: Props) => {
  if (!host) return null;

  return (
    <div className="card shadow-sm mb-4 homestay-detail-card host-card">
      <div className="card-body">
        <h5 className="card-title text-center mb-3">
          <i className="bi bi-person-circle me-2"></i>Chủ Homestay
        </h5>
        <ul className="list-group list-group-flush small">
          <li className="list-group-item px-0 d-flex justify-content-between">
            <span>Tên</span>
            <strong>{host.name}</strong>
          </li>
          <li className="list-group-item px-0 d-flex justify-content-between">
            <span>Email</span>
            <strong>{host.email}</strong>
          </li>
          <li className="list-group-item px-0 d-flex justify-content-between">
            <span>SĐT</span>
            <strong>{host.phone}</strong>
          </li>
          <li className="list-group-item px-0 d-flex justify-content-between">
            <span>Ngày tham gia</span>
            <strong>
              {new Date(host.created_at).toLocaleDateString()}
            </strong>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HostInfoCard;
