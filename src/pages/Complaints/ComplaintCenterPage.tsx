import { createComplaint, fetchMyComplaints } from "@/api/complaintApi";
import type { Complaint, ComplaintPayload } from "@/types/complaint";
import { showAlert } from "@/utils/showAlert";
import { useEffect, useState } from "react";

const ComplaintCenterPage = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formState, setFormState] = useState({
    subject: "",
    content: "",
    bookingId: "",
    homestayId: "",
  });

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const data = await fetchMyComplaints();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      showAlert("Unable to load complaints", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: ComplaintPayload = {
      subject: formState.subject,
      content: formState.content,
      bookingId: formState.bookingId ? Number(formState.bookingId) : undefined,
      homestayId: formState.homestayId ? Number(formState.homestayId) : undefined,
    };

    if (!payload.subject || !payload.content) {
      showAlert("Subject and content are required", "warning");
      return;
    }

    setCreating(true);
    try {
      await createComplaint(payload);
      showAlert("Complaint submitted", "success");
      setFormState({ subject: "", content: "", bookingId: "", homestayId: "" });
      loadComplaints();
    } catch (error) {
      showAlert("Failed to submit complaint", "danger");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="h3 mb-2">Complaint center</h1>
        <p className="text-muted mb-0">
          Track open issues and raise new complaints for follow-up.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">New complaint</h5>
              <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-12">
                  <label className="form-label" htmlFor="complaint-subject">
                    Subject
                  </label>
                  <input
                    className="form-control"
                    id="complaint-subject"
                    name="subject"
                    value={formState.subject}
                    onChange={(event) => setFormState((prev) => ({ ...prev, subject: event.target.value }))}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="complaint-content">
                    Details
                  </label>
                  <textarea
                    className="form-control"
                    id="complaint-content"
                    name="content"
                    rows={4}
                    value={formState.content}
                    onChange={(event) => setFormState((prev) => ({ ...prev, content: event.target.value }))}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="complaint-bookingId">
                    Booking ID
                  </label>
                  <input
                    className="form-control"
                    id="complaint-bookingId"
                    name="bookingId"
                    type="number"
                    min={1}
                    value={formState.bookingId}
                    onChange={(event) => setFormState((prev) => ({ ...prev, bookingId: event.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="complaint-homestayId">
                    Homestay ID
                  </label>
                  <input
                    className="form-control"
                    id="complaint-homestayId"
                    name="homestayId"
                    type="number"
                    min={1}
                    value={formState.homestayId}
                    onChange={(event) => setFormState((prev) => ({ ...prev, homestayId: event.target.value }))}
                  />
                </div>
                <div className="col-12 text-end">
                  <button className="btn btn-primary" disabled={creating} type="submit">
                    {creating ? "Submitting..." : "Submit complaint"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">My complaints</h5>
                <button className="btn btn-sm btn-outline-secondary" disabled={loading} onClick={loadComplaints} type="button">
                  {loading ? "Refreshing..." : "Refresh"}
                </button>
              </div>
              {loading ? (
                <div className="text-center py-5">Loading complaints...</div>
              ) : complaints.length === 0 ? (
                <div className="alert alert-info mb-0">No complaints submitted yet.</div>
              ) : (
                <ul className="list-group list-group-flush">
                  {complaints.map((complaint) => (
                    <li className="list-group-item" key={complaint.id}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-semibold">{complaint.subject}</div>
                          <div className="text-muted small">Status: {complaint.status ?? "pending"}</div>
                        </div>
                        <div className="text-muted small">{complaint.createdAt ?? "--"}</div>
                      </div>
                      <p className="mb-0 mt-2">{complaint.content}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCenterPage;
