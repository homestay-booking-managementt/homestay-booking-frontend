// Common styles for all Host pages with Green-Teal + Rainbow theme
export const hostCommonStyles = `
  /* Common Page Container */
  .host-page {
    position: relative;
    z-index: 1;
  }

  /* Page Header */
  .page-header {
    margin-bottom: 24px;
  }

  .page-header h1 {
    margin: 0 0 8px 0;
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .dark .page-header h1 {
    background: linear-gradient(135deg, #34d399 0%, #2dd4bf 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .page-header p {
    margin: 0;
    color: #64748b;
    font-size: 14px;
  }

  .dark .page-header p {
    color: #94a3b8;
  }

  /* Common Card */
  .host-card {
    background: #ffffff;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(148, 163, 184, 0.08);
    border: 1px solid rgba(226, 232, 240, 0.8);
    margin-bottom: 24px;
    position: relative;
    overflow: hidden;
  }

  .host-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      #10b981 0%, 
      #14b8a6 20%,
      #06b6d4 40%,
      #3b82f6 60%,
      #8b5cf6 80%,
      #ec4899 100%
    );
  }

  .dark .host-card {
    background: #1e293b;
    border-color: rgba(51, 65, 85, 0.8);
  }

  /* Card Header */
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .card-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .dark .card-title {
    background: linear-gradient(135deg, #34d399 0%, #2dd4bf 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Buttons */
  .btn-primary {
    padding: 10px 20px;
    background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
  }

  .btn-secondary {
    padding: 10px 20px;
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .dark .btn-secondary {
    background: #334155;
    color: #cbd5e1;
    border-color: #475569;
  }

  .btn-secondary:hover {
    background: #e2e8f0;
    transform: translateY(-2px);
  }

  .dark .btn-secondary:hover {
    background: #475569;
  }

  .btn-danger {
    padding: 10px 20px;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn-danger:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(239, 68, 68, 0.3);
  }

  .btn-success {
    padding: 10px 20px;
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn-success:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(34, 197, 94, 0.3);
  }

  /* Loading State */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #64748b;
  }

  .dark .loading-state {
    color: #94a3b8;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e2e8f0;
    border-top-color: #10b981;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 16px;
  }

  .dark .spinner {
    border-color: #334155;
    border-top-color: #34d399;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #64748b;
  }

  .dark .empty-state {
    color: #94a3b8;
  }

  .empty-state svg {
    font-size: 64px;
    color: #cbd5e1;
    margin-bottom: 16px;
  }

  .dark .empty-state svg {
    color: #475569;
  }

  /* Table */
  .data-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }

  .data-table thead th {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    padding: 16px;
    text-align: left;
    font-weight: 600;
    color: #475569;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #e2e8f0;
  }

  .dark .data-table thead th {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    color: #cbd5e1;
    border-bottom-color: #475569;
  }

  .data-table tbody tr {
    transition: all 0.2s ease;
    border-bottom: 1px solid #f1f5f9;
  }

  .dark .data-table tbody tr {
    border-bottom-color: #334155;
  }

  .data-table tbody tr:hover {
    background: #f8fafc;
    transform: scale(1.01);
  }

  .dark .data-table tbody tr:hover {
    background: #1e293b;
  }

  .data-table tbody td {
    padding: 16px;
    color: #1e293b;
    font-size: 14px;
  }

  .dark .data-table tbody td {
    color: #e2e8f0;
  }

  /* Status Badge */
  .status-badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .status-badge.pending {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
  }

  .status-badge.confirmed {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #1e3a8a;
  }

  .status-badge.completed {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    color: #065f46;
  }

  .status-badge.rejected,
  .status-badge.cancelled {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #991b1b;
  }

  /* Form Controls */
  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    display: block;
    margin-bottom: 8px;
    color: #475569;
    font-size: 14px;
    font-weight: 500;
  }

  .dark .form-label {
    color: #cbd5e1;
  }

  .form-control {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    color: #1e293b;
    background: #ffffff;
    transition: all 0.2s ease;
  }

  .dark .form-control {
    background: #1e293b;
    border-color: #475569;
    color: #e2e8f0;
  }

  .form-control:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .modal-content {
    background: #ffffff;
    border-radius: 16px;
    padding: 32px;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .dark .modal-content {
    background: #1e293b;
  }

  .modal-header {
    margin-bottom: 24px;
  }

  .modal-title {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .modal-footer {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #e2e8f0;
  }

  .dark .modal-footer {
    border-top-color: #475569;
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: #ffffff;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(148, 163, 184, 0.08);
    border: 1px solid rgba(226, 232, 240, 0.8);
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      #10b981 0%, 
      #14b8a6 50%,
      #06b6d4 100%
    );
  }

  .dark .stat-card {
    background: #1e293b;
    border-color: rgba(51, 65, 85, 0.8);
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(16, 185, 129, 0.15);
  }

  .stat-card.clickable {
    cursor: pointer;
  }

  .stat-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: white;
    flex-shrink: 0;
  }

  .stat-icon-green {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
  }

  .stat-icon-teal {
    background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
    box-shadow: 0 8px 16px rgba(20, 184, 166, 0.3);
  }

  .stat-icon-blue {
    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
    box-shadow: 0 8px 16px rgba(6, 182, 212, 0.3);
  }

  .stat-icon-yellow {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    box-shadow: 0 8px 16px rgba(245, 158, 11, 0.3);
  }

  .stat-content {
    flex: 1;
  }

  .stat-content h4 {
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .dark .stat-content h4 {
    color: #94a3b8;
  }

  .stat-value {
    margin: 0 0 4px 0;
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
  }

  .dark .stat-value {
    background: linear-gradient(135deg, #34d399 0%, #2dd4bf 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stat-detail {
    margin: 0;
    font-size: 13px;
    color: #64748b;
  }

  .dark .stat-detail {
    color: #94a3b8;
  }

  /* Charts Grid */
  .charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  .dashboard-card {
    background: #ffffff;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(148, 163, 184, 0.08);
    border: 1px solid rgba(226, 232, 240, 0.8);
    position: relative;
    overflow: hidden;
  }

  .dashboard-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      #10b981 0%, 
      #14b8a6 20%,
      #06b6d4 40%,
      #3b82f6 60%,
      #8b5cf6 80%,
      #ec4899 100%
    );
  }

  .dark .dashboard-card {
    background: #1e293b;
    border-color: rgba(51, 65, 85, 0.8);
  }

  .card-subtitle {
    margin: 4px 0 0 0;
    font-size: 13px;
    color: #64748b;
  }

  .dark .card-subtitle {
    color: #94a3b8;
  }

  /* Pie Chart */
  .chart-container {
    padding: 20px 0;
  }

  .pie-chart {
    width: 200px;
    height: 200px;
    margin: 0 auto 32px;
    border-radius: 50%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pie-center {
    position: absolute;
    width: 140px;
    height: 140px;
    background: #ffffff;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .dark .pie-center {
    background: #0f172a;
  }

  .pie-center-value {
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
  }

  .pie-center-label {
    font-size: 13px;
    color: #64748b;
    margin-top: 4px;
  }

  .dark .pie-center-label {
    color: #94a3b8;
  }

  .chart-legend {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    background: #f8fafc;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .dark .legend-item {
    background: #0f172a;
  }

  .legend-item:hover {
    background: #f1f5f9;
    transform: translateX(4px);
  }

  .dark .legend-item:hover {
    background: #1e293b;
  }

  .legend-label {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .legend-color {
    width: 16px;
    height: 16px;
    border-radius: 4px;
  }

  .legend-text {
    font-size: 14px;
    color: #475569;
  }

  .dark .legend-text {
    color: #cbd5e1;
  }

  .legend-value {
    font-weight: 600;
    color: #1e293b;
    font-size: 16px;
  }

  .dark .legend-value {
    color: #e2e8f0;
  }

  /* Bar Chart */
  .bar-chart {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .bar-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .bar-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
  }

  .bar-label-text {
    color: #475569;
    font-weight: 500;
  }

  .dark .bar-label-text {
    color: #cbd5e1;
  }

  .bar-label-value {
    color: #1e293b;
    font-weight: 600;
  }

  .dark .bar-label-value {
    color: #e2e8f0;
  }

  .bar-track {
    height: 32px;
    background: #f1f5f9;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
  }

  .dark .bar-track {
    background: #0f172a;
  }

  .bar-fill {
    height: 100%;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 12px;
    color: white;
    font-weight: 600;
    font-size: 13px;
    transition: width 0.8s ease;
    position: relative;
    overflow: hidden;
  }

  .bar-fill::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, 
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.2) 50%,
      rgba(255,255,255,0) 100%
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  /* Action Buttons */
  .action-buttons {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .action-btn {
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .action-btn-view {
    background: #f1f5f9;
    color: #475569;
  }

  .dark .action-btn-view {
    background: #334155;
    color: #cbd5e1;
  }

  .action-btn-view:hover {
    background: #e2e8f0;
    transform: translateY(-2px);
  }

  .dark .action-btn-view:hover {
    background: #475569;
  }

  .action-btn-edit {
    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
    color: white;
  }

  .action-btn-edit:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
  }

  .action-btn-delete {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
  }

  .action-btn-delete:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  .action-btn-confirm {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
  }

  .action-btn-confirm:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  /* Filters */
  .filters-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
    align-items: center;
  }

  .filter-item {
    flex: 1;
    min-width: 200px;
  }

  /* Pagination */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #e2e8f0;
  }

  .dark .pagination {
    border-top-color: #475569;
  }

  .pagination-btn {
    padding: 8px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: #ffffff;
    color: #475569;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  .dark .pagination-btn {
    background: #1e293b;
    border-color: #475569;
    color: #cbd5e1;
  }

  .pagination-btn:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #10b981;
    color: #10b981;
  }

  .dark .pagination-btn:hover:not(:disabled) {
    background: #334155;
    border-color: #34d399;
    color: #34d399;
  }

  .pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination-btn.active {
    background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
    border-color: transparent;
    color: white;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .charts-grid {
      grid-template-columns: 1fr;
    }

    .filters-bar {
      flex-direction: column;
    }

    .filter-item {
      width: 100%;
      min-width: auto;
    }

    .data-table {
      font-size: 12px;
    }

    .data-table thead th,
    .data-table tbody td {
      padding: 12px 8px;
    }

    .action-buttons {
      flex-wrap: wrap;
    }
  }
`;
