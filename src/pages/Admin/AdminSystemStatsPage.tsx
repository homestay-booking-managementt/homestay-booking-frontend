import { useEffect, useState } from "react";
import { showAlert } from "@/utils/showAlert";

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  totalBookings: number;
  completedBookings: number;
  canceledBookings: number;
  pendingBookings: number;
  totalHomestays: number;
  activeHomestays: number;
}

interface MonthlyData {
  month: string;
  revenue: number;
  bookings: number;
  newUsers: number;
}

const AdminSystemStatsPage = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month");
  const [exporting, setExporting] = useState(false);

  const loadSystemStats = async () => {
    setLoading(true);
    try {
      // TODO: Integrate with system stats API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockStats: SystemStats = {
        totalUsers: 1250,
        activeUsers: 890,
        totalRevenue: 458000000,
        totalBookings: 342,
        completedBookings: 280,
        canceledBookings: 25,
        pendingBookings: 37,
        totalHomestays: 156,
        activeHomestays: 142,
      };

      const mockMonthly: MonthlyData[] = [
        { month: "Jan 2025", revenue: 35000000, bookings: 28, newUsers: 45 },
        { month: "Feb 2025", revenue: 42000000, bookings: 35, newUsers: 52 },
        { month: "Mar 2025", revenue: 48000000, bookings: 38, newUsers: 61 },
        { month: "Apr 2025", revenue: 55000000, bookings: 45, newUsers: 68 },
        { month: "May 2025", revenue: 62000000, bookings: 52, newUsers: 74 },
        { month: "Jun 2025", revenue: 71000000, bookings: 58, newUsers: 82 },
      ];

      setStats(mockStats);
      setMonthlyData(mockMonthly);
    } catch (error) {
      showAlert("Unable to load system statistics", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSystemStats();
  }, [period]);

  const handleExport = async (format: "pdf" | "excel") => {
    setExporting(true);
    try {
      // TODO: Integrate with export API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showAlert(`Report exported as ${format.toUpperCase()}`, "success");
    } catch (error) {
      showAlert("Export failed", "danger");
    } finally {
      setExporting(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const bookingCompletionRate = Math.round((stats.completedBookings / stats.totalBookings) * 100);
  const userActiveRate = Math.round((stats.activeUsers / stats.totalUsers) * 100);
  const homestayActiveRate = Math.round((stats.activeHomestays / stats.totalHomestays) * 100);

  return (
    <div className="container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
        <div>
          <h1 className="h3 mb-2">System Statistics</h1>
          <p className="text-muted mb-0">Comprehensive overview of platform performance and metrics.</p>
        </div>
        <div className="d-flex gap-2">
          <select className="form-select" value={period} onChange={(e) => setPeriod(e.target.value as any)}>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            className="btn btn-outline-primary"
            disabled={exporting}
            onClick={() => handleExport("excel")}
            type="button"
          >
            Export Excel
          </button>
          <button
            className="btn btn-outline-secondary"
            disabled={exporting}
            onClick={() => handleExport("pdf")}
            type="button"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="text-muted small mb-1">Total Revenue</div>
              <div className="h3 fw-bold text-success mb-0">{stats.totalRevenue.toLocaleString()}₫</div>
              <div className="text-muted small mt-1">From {stats.totalBookings} bookings</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="text-muted small mb-1">Total Users</div>
              <div className="h3 fw-bold text-primary mb-0">{stats.totalUsers}</div>
              <div className="text-muted small mt-1">{userActiveRate}% active</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="text-muted small mb-1">Total Homestays</div>
              <div className="h3 fw-bold text-info mb-0">{stats.totalHomestays}</div>
              <div className="text-muted small mt-1">{homestayActiveRate}% active</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="text-muted small mb-1">Booking Completion</div>
              <div className="h3 fw-bold text-warning mb-0">{bookingCompletionRate}%</div>
              <div className="text-muted small mt-1">
                {stats.completedBookings} / {stats.totalBookings}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Breakdown */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-4">Booking Status Breakdown</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="p-3 bg-success-subtle rounded">
                <div className="text-muted small">Completed</div>
                <div className="h4 fw-bold text-success mb-0">{stats.completedBookings}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 bg-warning-subtle rounded">
                <div className="text-muted small">Pending</div>
                <div className="h4 fw-bold text-warning mb-0">{stats.pendingBookings}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 bg-danger-subtle rounded">
                <div className="text-muted small">Canceled</div>
                <div className="h4 fw-bold text-danger mb-0">{stats.canceledBookings}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-4">Monthly Trends</h5>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Month</th>
                  <th className="text-end">Revenue</th>
                  <th className="text-end">Bookings</th>
                  <th className="text-end">New Users</th>
                  <th className="text-end">Avg/Booking</th>
                  <th className="text-end">Growth</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((data, index) => {
                  const avgPerBooking = Math.round(data.revenue / data.bookings);
                  const growth =
                    index > 0
                      ? Math.round(((data.revenue - monthlyData[index - 1].revenue) / monthlyData[index - 1].revenue) * 100)
                      : 0;

                  return (
                    <tr key={data.month}>
                      <td>{data.month}</td>
                      <td className="text-end fw-semibold">{data.revenue.toLocaleString()}₫</td>
                      <td className="text-end">{data.bookings}</td>
                      <td className="text-end">{data.newUsers}</td>
                      <td className="text-end text-muted">{avgPerBooking.toLocaleString()}₫</td>
                      <td className="text-end">
                        {growth > 0 ? (
                          <span className="text-success">↑ {growth}%</span>
                        ) : growth < 0 ? (
                          <span className="text-danger">↓ {Math.abs(growth)}%</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">User Engagement</h5>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Active Users</span>
                  <span className="fw-semibold">{stats.activeUsers}</span>
                </div>
                <div className="progress" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${userActiveRate}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Inactive Users</span>
                  <span className="fw-semibold">{stats.totalUsers - stats.activeUsers}</span>
                </div>
                <div className="progress" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-secondary"
                    role="progressbar"
                    style={{ width: `${100 - userActiveRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Homestay Listings</h5>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Active Listings</span>
                  <span className="fw-semibold">{stats.activeHomestays}</span>
                </div>
                <div className="progress" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-info"
                    role="progressbar"
                    style={{ width: `${homestayActiveRate}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Inactive Listings</span>
                  <span className="fw-semibold">{stats.totalHomestays - stats.activeHomestays}</span>
                </div>
                <div className="progress" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-secondary"
                    role="progressbar"
                    style={{ width: `${100 - homestayActiveRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemStatsPage;
