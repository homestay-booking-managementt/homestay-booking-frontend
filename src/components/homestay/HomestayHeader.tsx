import type { Homestay } from "@/types/homestay";

interface Props {
  homestay: Homestay;
  formatCurrency: (value: number | undefined) => string;
}

const HomestayHeader = ({ homestay, formatCurrency }: Props) => {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
      <div>
        <h1 className="h3 fw-bold mb-1">{homestay.name}</h1>
        <p className="text-muted mb-1">
          <i className="bi bi-geo-alt me-1" />
          {homestay.address}
        </p>
        {homestay.rating && (
          <p className="text-warning mb-0">
            <i className="bi bi-star-fill me-1" />
            {homestay.rating.toFixed(1)} / 5.0
          </p>
        )}
      </div>
      <div className="text-end mt-3 mt-md-0">
        <h4 className="text-primary mb-0">
          {formatCurrency(homestay.base_price)} / đêm
        </h4>
        <small className="text-muted">
          Sức chứa: {homestay.capacity} khách
        </small>
      </div>
    </div>
  );
};

export default HomestayHeader;
