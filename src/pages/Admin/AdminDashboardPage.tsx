import {
  createAdminFaq,
  deleteAdminFaq,
  fetchAdminBookings,
  fetchAdminComplaints,
  fetchAdminFaqs,
  fetchPendingHomestayRequests,
  fetchRevenueReport,
  fetchUsers,
  reviewHomestayRequest,
  updateAdminFaq,
  updateUserStatus,
} from "@/api/adminApi";
import type {
  AdminBookingSummary,
  AdminComplaintSummary,
  AdminFaqItem,
  AdminHomestayRequest,
  AdminRevenueReport,
  AdminUser,
} from "@/types/admin";
import { showAlert } from "@/utils/showAlert";
import { useEffect, useMemo, useState } from "react";

const AdminDashboardPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [requests, setRequests] = useState<AdminHomestayRequest[]>([]);
  const [bookings, setBookings] = useState<AdminBookingSummary[]>([]);
  const [complaints, setComplaints] = useState<AdminComplaintSummary[]>([]);
  const [revenue, setRevenue] = useState<AdminRevenueReport | null>(null);
  const [faqs, setFaqs] = useState<AdminFaqItem[]>([]);

  const [loading, setLoading] = useState(false);

  const [userForm, setUserForm] = useState({ userId: "", status: "1" });
  const [requestForm, setRequestForm] = useState({ requestId: "", status: "approved", comment: "" });
  const [faqForm, setFaqForm] = useState({ question: "", answer: "", category: "" });
  const [faqEditForm, setFaqEditForm] = useState({ id: "", question: "", answer: "", category: "" });

  const [submittingUser, setSubmittingUser] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [creatingFaq, setCreatingFaq] = useState(false);
  const [updatingFaq, setUpdatingFaq] = useState(false);

  const totalRevenue = useMemo(() => {
    if (!revenue?.items) {
      return 0;
    }
    return revenue.items.reduce((sum, item) => sum + (item.totalRevenue ?? 0), 0);
  }, [revenue]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, requestsData, bookingsData, complaintsData, revenueData, faqsData] = await Promise.all([
        fetchUsers(),
        fetchPendingHomestayRequests(),
        fetchAdminBookings(),
        fetchAdminComplaints(),
        fetchRevenueReport(),
        fetchAdminFaqs(),
      ]);

      setUsers(Array.isArray(usersData) ? usersData : []);
      setRequests(Array.isArray(requestsData) ? requestsData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setComplaints(Array.isArray(complaintsData) ? complaintsData : []);
      setRevenue(revenueData ?? null);
      setFaqs(Array.isArray(faqsData) ? faqsData : []);
    } catch (error) {
      showAlert("Unable to load admin data", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUserStatusSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userId = Number(userForm.userId);
    if (Number.isNaN(userId)) {
      showAlert("User ID must be a number", "warning");
      return;
    }

    setSubmittingUser(true);
    try {
      await updateUserStatus(userId, { status: Number(userForm.status) as 0 | 1 });
      showAlert("User status updated", "success");
      setUserForm({ userId: "", status: userForm.status });
      loadData();
    } catch (error) {
      showAlert("Unable to update user", "danger");
    } finally {
      setSubmittingUser(false);
    }
  };

  const handleRequestReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requestId = Number(requestForm.requestId);
    if (Number.isNaN(requestId)) {
      showAlert("Request ID must be numeric", "warning");
      return;
    }

    setSubmittingRequest(true);
    try {
      await reviewHomestayRequest(requestId, {
        status: requestForm.status as "approved" | "rejected",
        adminComment: requestForm.comment || undefined,
      });
      showAlert("Request reviewed", "success");
      setRequestForm({ requestId: "", status: "approved", comment: "" });
      loadData();
    } catch (error) {
      showAlert("Unable to review request", "danger");
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleCreateFaq = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!faqForm.question || !faqForm.answer) {
      showAlert("Question and answer are required", "warning");
      return;
    }

    setCreatingFaq(true);
    try {
      await createAdminFaq({
        question: faqForm.question,
        answer: faqForm.answer,
        category: faqForm.category || undefined,
      });
      showAlert("FAQ created", "success");
      setFaqForm({ question: "", answer: "", category: "" });
      loadData();
    } catch (error) {
      showAlert("Unable to create FAQ", "danger");
    } finally {
      setCreatingFaq(false);
    }
  };

  const handleUpdateFaq = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const faqId = Number(faqEditForm.id);
    if (Number.isNaN(faqId)) {
      showAlert("FAQ ID must be numeric", "warning");
      return;
    }

    if (!faqEditForm.question || !faqEditForm.answer) {
      showAlert("Question and answer are required", "warning");
      return;
    }

    setUpdatingFaq(true);
    try {
      await updateAdminFaq(faqId, {
        question: faqEditForm.question,
        answer: faqEditForm.answer,
        category: faqEditForm.category || undefined,
      });
      showAlert("FAQ updated", "success");
      setFaqEditForm({ id: "", question: "", answer: "", category: "" });
      loadData();
    } catch (error) {
      showAlert("Unable to update FAQ", "danger");
    } finally {
      setUpdatingFaq(false);
    }
  };

  const handleDeleteFaq = async (faqId: number) => {
    if (typeof window !== "undefined" && !window.confirm("Delete this FAQ?")) {
      return;
    }
    try {
      await deleteAdminFaq(faqId);
      showAlert("FAQ deleted", "success");
      loadData();
    } catch (error) {
      showAlert("Unable to delete FAQ", "danger");
    }
  };

  const activeUsers = users.filter((user) => user.status === 1);
  const inactiveUsers = users.length - activeUsers.length;
  const pendingRequests = requests.length;
  const openComplaints = complaints.filter((complaint) => complaint.status !== "resolved").length;

  return (
    <div className="container">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
        <div>
          <h1 className="h3 mb-2">Admin dashboard</h1>
          <p className="text-muted mb-0">Monitor platform health and perform administrative actions.</p>
        </div>
        <div className="text-end">
          <div className="fw-semibold">Total revenue</div>
          <div>${totalRevenue.toLocaleString()}</div>
          {revenue?.generatedAt ? <div className="text-muted small">Updated {revenue.generatedAt}</div> : null}
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="text-muted small">Active users</div>
              <div className="h4 mb-0">{activeUsers.length}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="text-muted small">Inactive users</div>
              <div className="h4 mb-0">{inactiveUsers}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="text-muted small">Pending homestays</div>
              <div className="h4 mb-0">{pendingRequests}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="text-muted small">Open complaints</div>
              <div className="h4 mb-0">{openComplaints}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">Users</h5>
            <button className="btn btn-sm btn-outline-secondary" disabled={loading} onClick={loadData} type="button">
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={`badge ${user.status === 1 ? "bg-success-subtle" : "bg-secondary-subtle"}`}>
                        {user.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Update user status</h5>
              <form className="row g-3" onSubmit={handleUserStatusSubmit}>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="admin-user-id">
                    User ID
                  </label>
                  <input
                    className="form-control"
                    id="admin-user-id"
                    name="userId"
                    type="number"
                    min={1}
                    value={userForm.userId}
                    onChange={(event) => setUserForm((prev) => ({ ...prev, userId: event.target.value }))}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="admin-user-status">
                    Status
                  </label>
                  <select
                    className="form-select"
                    id="admin-user-status"
                    name="status"
                    value={userForm.status}
                    onChange={(event) => setUserForm((prev) => ({ ...prev, status: event.target.value }))}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
                <div className="col-12 text-end">
                  <button className="btn btn-outline-primary" disabled={submittingUser} type="submit">
                    {submittingUser ? "Updating..." : "Update user"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Review homestay request</h5>
              <form className="row g-3" onSubmit={handleRequestReview}>
                <div className="col-md-4">
                  <label className="form-label" htmlFor="admin-request-id">
                    Request ID
                  </label>
                  <input
                    className="form-control"
                    id="admin-request-id"
                    name="requestId"
                    type="number"
                    min={1}
                    value={requestForm.requestId}
                    onChange={(event) => setRequestForm((prev) => ({ ...prev, requestId: event.target.value }))}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label" htmlFor="admin-request-status">
                    Decision
                  </label>
                  <select
                    className="form-select"
                    id="admin-request-status"
                    name="status"
                    value={requestForm.status}
                    onChange={(event) => setRequestForm((prev) => ({ ...prev, status: event.target.value }))}
                  >
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label" htmlFor="admin-request-comment">
                    Comment
                  </label>
                  <input
                    className="form-control"
                    id="admin-request-comment"
                    name="comment"
                    value={requestForm.comment}
                    onChange={(event) => setRequestForm((prev) => ({ ...prev, comment: event.target.value }))}
                    placeholder="Optional"
                  />
                </div>
                <div className="col-12 text-end">
                  <button className="btn btn-outline-primary" disabled={submittingRequest} type="submit">
                    {submittingRequest ? "Submitting..." : "Submit review"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Latest bookings</h5>
              {bookings.length === 0 ? (
                <div className="alert alert-info mb-0">No booking records.</div>
              ) : (
                <ul className="list-group list-group-flush">
                  {bookings.slice(0, 6).map((booking) => (
                    <li className="list-group-item" key={booking.id}>
                      <div className="fw-semibold">{booking.homestayName}</div>
                      <div className="text-muted small">{booking.guestName}</div>
                      <div className="small">Status: {booking.status}</div>
                      {typeof booking.totalPrice === "number" ? (
                        <div className="small text-muted">
                          Total: ${(booking.totalPrice as number).toLocaleString()}
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Open complaints</h5>
              {complaints.length === 0 ? (
                <div className="alert alert-info mb-0">No complaints recorded.</div>
              ) : (
                <ul className="list-group list-group-flush">
                  {complaints.slice(0, 6).map((complaint) => (
                    <li className="list-group-item" key={complaint.id}>
                      <div className="fw-semibold">{complaint.subject}</div>
                      <div className="small">Status: {complaint.status}</div>
                      {complaint.assignedTo ? (
                        <div className="text-muted small">Assigned to {complaint.assignedTo}</div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title">Revenue breakdown</h5>
          {revenue?.items?.length ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Homestay</th>
                    <th>Revenue</th>
                    <th>Month</th>
                  </tr>
                </thead>
                <tbody>
                  {revenue.items.map((item) => (
                    <tr key={`${item.homestayId}-${item.month ?? "all"}`}>
                      <td>{item.homestayName}</td>
                      <td>${item.totalRevenue.toLocaleString()}</td>
                      <td>{item.month ?? "All time"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info mb-0">No revenue data yet.</div>
          )}
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Manage FAQs</h5>
          <div className="row g-4">
            <div className="col-lg-6">
              <h6>Create new FAQ</h6>
              <form className="row g-3" onSubmit={handleCreateFaq}>
                <div className="col-12">
                  <label className="form-label" htmlFor="admin-faq-question">
                    Question
                  </label>
                  <input
                    className="form-control"
                    id="admin-faq-question"
                    name="question"
                    value={faqForm.question}
                    onChange={(event) => setFaqForm((prev) => ({ ...prev, question: event.target.value }))}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="admin-faq-answer">
                    Answer
                  </label>
                  <textarea
                    className="form-control"
                    id="admin-faq-answer"
                    name="answer"
                    rows={3}
                    value={faqForm.answer}
                    onChange={(event) => setFaqForm((prev) => ({ ...prev, answer: event.target.value }))}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="admin-faq-category">
                    Category (optional)
                  </label>
                  <input
                    className="form-control"
                    id="admin-faq-category"
                    name="category"
                    value={faqForm.category}
                    onChange={(event) => setFaqForm((prev) => ({ ...prev, category: event.target.value }))}
                  />
                </div>
                <div className="col-12 text-end">
                  <button className="btn btn-primary" disabled={creatingFaq} type="submit">
                    {creatingFaq ? "Creating..." : "Create FAQ"}
                  </button>
                </div>
              </form>
            </div>

            <div className="col-lg-6">
              <h6>Update existing FAQ</h6>
              <form className="row g-3" onSubmit={handleUpdateFaq}>
                <div className="col-12">
                  <label className="form-label" htmlFor="admin-faq-id">
                    FAQ ID
                  </label>
                  <input
                    className="form-control"
                    id="admin-faq-id"
                    name="id"
                    type="number"
                    min={1}
                    value={faqEditForm.id}
                    onChange={(event) => setFaqEditForm((prev) => ({ ...prev, id: event.target.value }))}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="admin-faq-edit-question">
                    Question
                  </label>
                  <input
                    className="form-control"
                    id="admin-faq-edit-question"
                    name="question"
                    value={faqEditForm.question}
                    onChange={(event) => setFaqEditForm((prev) => ({ ...prev, question: event.target.value }))}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="admin-faq-edit-answer">
                    Answer
                  </label>
                  <textarea
                    className="form-control"
                    id="admin-faq-edit-answer"
                    name="answer"
                    rows={3}
                    value={faqEditForm.answer}
                    onChange={(event) => setFaqEditForm((prev) => ({ ...prev, answer: event.target.value }))}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="admin-faq-edit-category">
                    Category (optional)
                  </label>
                  <input
                    className="form-control"
                    id="admin-faq-edit-category"
                    name="category"
                    value={faqEditForm.category}
                    onChange={(event) => setFaqEditForm((prev) => ({ ...prev, category: event.target.value }))}
                  />
                </div>
                <div className="col-12 text-end">
                  <button className="btn btn-outline-primary" disabled={updatingFaq} type="submit">
                    {updatingFaq ? "Updating..." : "Update FAQ"}
                  </button>
                </div>
              </form>

              <hr />
              <h6>Existing FAQs</h6>
              {faqs.length === 0 ? (
                <div className="alert alert-info mb-0">No FAQs found.</div>
              ) : (
                <ul className="list-group list-group-flush">
                  {faqs.map((faq) => (
                    <li className="list-group-item d-flex justify-content-between align-items-start" key={faq.id}>
                      <div>
                        <div className="fw-semibold">{faq.question}</div>
                        <div className="text-muted small">{faq.category ?? "General"}</div>
                        <div className="small">{faq.answer}</div>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteFaq(faq.id)}
                        type="button"
                      >
                        Delete
                      </button>
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

export default AdminDashboardPage;
