import { useEffect, useState } from "react";
import { showAlert } from "@/utils/showAlert";

interface PendingHomestay {
  id: number;
  name: string;
  ownerName: string;
  ownerEmail: string;
  address: string;
  description: string;
  pricePerNight: number;
  images: string[];
  amenities: string[];
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

const AdminHomestayApprovalPage = () => {
  const [homestays, setHomestays] = useState<PendingHomestay[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<number | null>(null);
  const [selectedHomestay, setSelectedHomestay] = useState<PendingHomestay | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const loadPendingHomestays = async () => {
    setLoading(true);
    try {
      // TODO: Integrate with pending homestays API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockData: PendingHomestay[] = [
        {
          id: 1,
          name: "Mountain View Homestay",
          ownerName: "Nguyen Van A",
          ownerEmail: "owner@example.com",
          address: "123 Mountain Road, Da Lat",
          description: "Beautiful homestay with mountain views",
          pricePerNight: 500000,
          images: ["img1.jpg", "img2.jpg"],
          amenities: ["WiFi", "Kitchen", "Parking"],
          status: "pending",
          submittedAt: "2025-11-05T10:00:00Z",
        },
      ];
      setHomestays(mockData);
    } catch (error) {
      showAlert("Unable to load pending homestays", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingHomestays();
  }, []);

  const handleApprove = async (homestayId: number) => {
    if (typeof window !== "undefined" && !window.confirm("Approve this homestay listing?")) {
      return;
    }

    setProcessing(homestayId);
    try {
      // TODO: Integrate with approval API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showAlert("Homestay approved and published", "success");
      setHomestays((prev) => prev.filter((h) => h.id !== homestayId));
    } catch (error) {
      showAlert("Failed to approve homestay", "danger");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (homestayId: number) => {
    if (!rejectReason.trim()) {
      showAlert("Please provide a rejection reason", "warning");
      return;
    }

    setProcessing(homestayId);
    try {
      // TODO: Integrate with rejection API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showAlert("Homestay rejected. Owner will be notified.", "success");
      setHomestays((prev) => prev.filter((h) => h.id !== homestayId));
      setSelectedHomestay(null);
      setRejectReason("");
    } catch (error) {
      showAlert("Failed to reject homestay", "danger");
    } finally {
      setProcessing(null);
    }
  };

  const pendingCount = homestays.filter((h) => h.status === "pending").length;

  return (
    <div className="container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
        <div>
          <h1 className="h3 mb-2">Homestay Approval</h1>
          <p className="text-muted mb-0">Review and approve new homestay listings from hosts.</p>
        </div>
        <div className="text-end">
          <div className="fw-semibold">Pending approvals</div>
          <div className="h4 mb-0 text-warning">{pendingCount}</div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : homestays.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <p className="text-muted mb-0">No pending homestays to review.</p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {homestays.map((homestay) => (
            <div className="col-12" key={homestay.id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="row g-4">
                    <div className="col-lg-8">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <h5 className="card-title mb-0">{homestay.name}</h5>
                        <span className="badge bg-warning-subtle text-warning-emphasis">Pending Review</span>
                      </div>

                      <div className="mb-3">
                        <div className="text-muted small">Owner</div>
                        <div className="fw-semibold">{homestay.ownerName}</div>
                        <div className="text-muted small">{homestay.ownerEmail}</div>
                      </div>

                      <div className="mb-3">
                        <div className="text-muted small">Location</div>
                        <div>{homestay.address}</div>
                      </div>

                      <div className="mb-3">
                        <div className="text-muted small">Description</div>
                        <p className="mb-0">{homestay.description}</p>
                      </div>

                      <div className="mb-3">
                        <div className="text-muted small">Price</div>
                        <div className="fw-bold text-primary">{homestay.pricePerNight.toLocaleString()}₫ / night</div>
                      </div>

                      <div className="mb-3">
                        <div className="text-muted small">Amenities</div>
                        <div className="d-flex flex-wrap gap-2">
                          {homestay.amenities.map((amenity, idx) => (
                            <span key={idx} className="badge bg-secondary-subtle text-secondary-emphasis">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="text-muted small">Images</div>
                        <div className="text-muted">{homestay.images.length} photo(s) uploaded</div>
                      </div>

                      <div className="text-muted small">
                        Submitted: {new Date(homestay.submittedAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="card bg-light border-0">
                        <div className="card-body">
                          <h6 className="card-title mb-3">Review Actions</h6>
                          {selectedHomestay?.id === homestay.id ? (
                            <div>
                              <label className="form-label" htmlFor={`reject-reason-${homestay.id}`}>
                                Rejection Reason
                              </label>
                              <textarea
                                className="form-control mb-3"
                                id={`reject-reason-${homestay.id}`}
                                rows={4}
                                placeholder="Provide detailed reason for rejection..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                              />
                              <div className="d-grid gap-2">
                                <button
                                  className="btn btn-danger"
                                  disabled={processing === homestay.id || !rejectReason.trim()}
                                  onClick={() => handleReject(homestay.id)}
                                  type="button"
                                >
                                  {processing === homestay.id ? "Rejecting..." : "Confirm Rejection"}
                                </button>
                                <button
                                  className="btn btn-outline-secondary"
                                  onClick={() => {
                                    setSelectedHomestay(null);
                                    setRejectReason("");
                                  }}
                                  type="button"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="d-grid gap-2">
                              <button
                                className="btn btn-success"
                                disabled={processing === homestay.id}
                                onClick={() => handleApprove(homestay.id)}
                                type="button"
                              >
                                {processing === homestay.id ? "Approving..." : "Approve & Publish"}
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => setSelectedHomestay(homestay)}
                                type="button"
                              >
                                Reject
                              </button>
                              <button className="btn btn-outline-secondary" type="button">
                                View Full Details
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
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

export default AdminHomestayApprovalPage;
