import { fetchMyHomestays } from "@/api/homestayApi";
import type { Homestay } from "@/types/homestay";
import { showAlert } from "@/utils/showAlert";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MyHomestaysPage = () => {
  const [loading, setLoading] = useState(true);
  const [homestays, setHomestays] = useState<Homestay[]>([]);

  const loadHomestays = async () => {
    setLoading(true);
    try {
      const data = await fetchMyHomestays();
      setHomestays(Array.isArray(data) ? data : []);
    } catch (error) {
      showAlert("Unable to load your homestay list", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomestays();
  }, []);

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || Number.isNaN(value)) {
      return "--";
    }

    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusClass = (status?: string) => {
    if (!status) {
      return "bg-secondary";
    }

    switch (status.toLowerCase()) {
      case "approved":
      case "active":
        return "bg-success";
      case "pending":
        return "bg-warning text-dark";
      case "rejected":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
        <div>
          <h1 className="h3 mb-1">My Homestays</h1>
          <p className="text-muted mb-0">Manage the homestays you own, including their current approval status.</p>
        </div>
        <Link className="btn btn-primary mt-3 mt-md-0" to="/homestays/new">
          + Add Homestay
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">Loading listings...</div>
      ) : homestays.length === 0 ? (
        <div className="alert alert-info">
          You do not have any homestays yet. Get started by
          <Link className="ms-1" to="/homestays/new">
            creating a new homestay
          </Link>
          .
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
          {homestays.map((homestay) => (
            <div className="col" key={homestay.id}>
              <div className="card h-100 shadow-sm">
                {homestay.images && homestay.images.length > 0 ? (
                  <img
                    alt={homestay.name}
                    className="card-img-top"
                    height={200}
                    src={homestay.images[0]}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: 200 }}>
                    <span className="text-muted">No image available</span>
                  </div>
                )}
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{homestay.name}</h5>
                    {homestay.status && (
                      <span className={`badge ${getStatusClass(homestay.status)}`}>
                        {homestay.status}
                      </span>
                    )}
                  </div>
                  <p className="text-muted mb-2">
                    {homestay.address}, {homestay.city}
                  </p>
                  <p className="mb-2">Price: {formatCurrency(homestay.pricePerNight)}</p>
                  <p className="mb-3">Capacity: {homestay.capacity} guests</p>
                  <div className="mt-auto d-flex gap-2">
                    <Link className="btn btn-outline-primary flex-grow-1" to={`/homestays/${homestay.id}`}>
                      View details
                    </Link>
                    <Link className="btn btn-primary" to={`/homestays/${homestay.id}/edit`}>
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyHomestaysPage;
