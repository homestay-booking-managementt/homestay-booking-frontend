import { useEffect, useState } from "react";
import { showAlert } from "@/utils/showAlert";

interface RevenueData {
  period: string;
  revenue: number;
  bookings: number;
}

interface RevenueStats {
  totalRevenue: number;
  totalBookings: number;
  averageBookingValue: number;
  periodData: RevenueData[];
}

const HostRevenueReportPage = () => {
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  const loadRevenueData = async () => {
    setLoading(true);
    try {
      // TODO: Integrate with revenue statistics API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockStats: RevenueStats = {
        totalRevenue: 45800000,
        totalBookings: 28,
        averageBookingValue: 1635714,
        periodData: [
          { period: "Week 1", revenue: 8500000, bookings: 5 },
          { period: "Week 2", revenue: 12300000, bookings: 7 },
          { period: "Week 3", revenue: 10200000, bookings: 6 },
          { period: "Week 4", revenue: 14800000, bookings: 10 },
        ],
      };
      setStats(mockStats);
    } catch (error) {
      showAlert("Unable to load revenue data", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRevenueData();
  }, [period]);

  const handleExport = () => {
    showAlert("Export functionality coming soon", "info");
  };

  return (
    <div className="container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
        <div>
          <h1 className="h3 mb-2">Revenue Statistics</h1>
          <p className="text-muted mb-0">Track your homestay earnings and booking performance.</p>
        </div>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value as "week" | "month" | "year")}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="btn btn-outline-primary" onClick={handleExport} type="button">
            Export Excel
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : !stats ? (
        <div className="alert alert-info">No revenue data available yet.</div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="text-muted small mb-1">Total Revenue</div>
                  <div className="h3 fw-bold text-success mb-0">{stats.totalRevenue.toLocaleString()}₫</div>
                  <div className="text-muted small mt-1">+12% vs last period</div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="text-muted small mb-1">Total Bookings</div>
                  <div className="h3 fw-bold text-primary mb-0">{stats.totalBookings}</div>
                  <div className="text-muted small mt-1">Completed reservations</div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="text-muted small mb-1">Average Booking Value</div>
                  <div className="h3 fw-bold text-info mb-0">{stats.averageBookingValue.toLocaleString()}₫</div>
                  <div className="text-muted small mt-1">Per reservation</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Revenue Breakdown</h5>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Period</th>
                      <th className="text-end">Revenue</th>
                      <th className="text-end">Bookings</th>
                      <th className="text-end">Avg/Booking</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.periodData.map((data, index) => (
                      <tr key={index}>
                        <td>{data.period}</td>
                        <td className="text-end fw-semibold">{data.revenue.toLocaleString()}₫</td>
                        <td className="text-end">{data.bookings}</td>
                        <td className="text-end text-muted">
                          {Math.round(data.revenue / data.bookings).toLocaleString()}₫
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="table-active fw-bold">
                      <td>Total</td>
                      <td className="text-end">{stats.totalRevenue.toLocaleString()}₫</td>
                      <td className="text-end">{stats.totalBookings}</td>
                      <td className="text-end">{stats.averageBookingValue.toLocaleString()}₫</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mt-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Payment Information</h5>
              <div className="alert alert-info mb-0">
                <div className="d-flex align-items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      className="bi bi-info-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                    </svg>
                  </div>
                  <div>
                    <h6 className="mb-2">How payments work</h6>
                    <p className="mb-2">
                      Revenue is automatically transferred to your registered account after guests successfully check
                      in. The process typically takes 1-3 business days.
                    </p>
                    <p className="mb-0">
                      <strong>Payment schedule:</strong> Funds are released after guest check-in is confirmed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HostRevenueReportPage;
