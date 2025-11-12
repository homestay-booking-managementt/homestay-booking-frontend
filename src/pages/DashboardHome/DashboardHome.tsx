const DashboardHome = () => {
  return (
    <div className="container py-4">
      <section className="bg-primary bg-gradient text-white rounded-4 p-4 p-md-5 shadow-sm">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">
          <div>
            <span className="badge bg-light text-primary mb-2">Welcome back</span>
            <h1 className="display-5 fw-bold mb-3">Manage your homestays effortlessly</h1>
            <p className="lead mb-0">
              Monitor listing status, bookings, and guest feedback from one dashboard.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white text-primary rounded-4 p-4 shadow-sm">
              <p className="fw-semibold mb-1">Revenue this month</p>
              <h2 className="display-6 fw-bold mb-0">45.800.000₫</h2>
              <small className="text-muted">+12% vs last month</small>
            </div>
          </div>
        </div>
      </section>

      <section className="row row-cols-1 row-cols-md-3 g-4 mt-1">
        <div className="col">
          <div className="card h-100 shadow-sm border-0 rounded-4">
            <div className="card-body">
              <span className="badge bg-primary-subtle text-primary-emphasis mb-2">Overview</span>
              <h5 className="card-title">Active homestays</h5>
              <p className="display-6 fw-bold text-primary">8</p>
              <p className="text-muted mb-0">
                Includes listings currently awaiting admin approval.
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100 shadow-sm border-0 rounded-4">
            <div className="card-body">
              <span className="badge bg-success-subtle text-success-emphasis mb-2">Bookings</span>
              <h5 className="card-title">Bookings in progress</h5>
              <p className="display-6 fw-bold text-success">14</p>
              <p className="text-muted mb-0">
                Track guest confirmations and payment status in real time.
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100 shadow-sm border-0 rounded-4">
            <div className="card-body">
              <span className="badge bg-warning-subtle text-warning-emphasis mb-2">Reviews</span>
              <h5 className="card-title">Average satisfaction score</h5>
              <p className="display-6 fw-bold text-warning">4.7/5</p>
              <p className="text-muted mb-0">Based on the 128 most recent guest responses.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="row g-4 mt-1">
        <div className="col-lg-7">
          <div className="card h-100 shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h4 className="card-title mb-3">Quick start checklist</h4>
              <p className="text-muted">
                Complete these steps to keep every homestay ready for guests.
              </p>
              <div className="list-group list-group-flush">
                <div className="list-group-item px-0 d-flex align-items-start gap-3">
                  <div className="badge rounded-pill text-bg-primary mt-1">1</div>
                  <div>
                    <h6 className="fw-semibold mb-1">Update availability for each homestay</h6>
                    <p className="text-muted mb-0">
                      Make sure guests can book on the dates that work.
                    </p>
                  </div>
                </div>
                <div className="list-group-item px-0 d-flex align-items-start gap-3">
                  <div className="badge rounded-pill text-bg-primary mt-1">2</div>
                  <div>
                    <h6 className="fw-semibold mb-1">Add standout photos or videos</h6>
                    <p className="text-muted mb-0">
                      High-quality visuals boost booking conversion rates.
                    </p>
                  </div>
                </div>
                <div className="list-group-item px-0 d-flex align-items-start gap-3">
                  <div className="badge rounded-pill text-bg-primary mt-1">3</div>
                  <div>
                    <h6 className="fw-semibold mb-1">Review the latest guest feedback</h6>
                    <p className="text-muted mb-0">
                      Respond quickly to keep the guest experience excellent.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card h-100 shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h4 className="card-title mb-3">Support & resources</h4>
              <div className="d-flex flex-column gap-3">
                <div className="p-3 bg-light rounded-3">
                  <h6 className="fw-semibold mb-1">Help center</h6>
                  <p className="text-muted mb-2">
                    Learn how the platform works and explore detailed guides.
                  </p>
                  <a className="btn btn-sm btn-primary" href="#">
                    View guides
                  </a>
                </div>
                <div className="p-3 bg-light rounded-3">
                  <h6 className="fw-semibold mb-1">Contact the RM Homestay team</h6>
                  <p className="text-muted mb-2">We are here 24/7 via live chat or hotline.</p>
                  <a className="btn btn-sm btn-outline-primary" href="#">
                    Start a chat
                  </a>
                </div>
                <div className="p-3 bg-light rounded-3">
                  <h6 className="fw-semibold mb-1">Policies & guidelines</h6>
                  <p className="text-muted mb-2">
                    Stay up to date on refunds and host protection policies.
                  </p>
                  <a className="btn btn-sm btn-outline-secondary" href="#">
                    View details
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;
