import { useState } from 'react';
import styles from './ReportsPage.module.css';

interface DepartmentUtilization {
  dept: string;
  percentage: number;
  allocated: number;
  total: number;
}

const DEPT_UTILIZATION: DepartmentUtilization[] = [
  { dept: 'Engineering', percentage: 88, allocated: 44, total: 50 },
  { dept: 'Facilities', percentage: 64, allocated: 16, total: 25 },
  { dept: 'Field Ops', percentage: 76, allocated: 38, total: 50 },
  { dept: 'Marketing', percentage: 48, allocated: 12, total: 25 },
  { dept: 'Operations', percentage: 60, allocated: 18, total: 30 },
];

const MAINTENANCE_TREND = [
  { month: 'Jan', incidents: 4 },
  { month: 'Feb', incidents: 7 },
  { month: 'Mar', incidents: 3 },
  { month: 'Apr', incidents: 10 },
  { month: 'May', incidents: 6 },
  { month: 'Jun', incidents: 9 },
  { month: 'Jul', incidents: 5 },
];

const MOST_USED_ASSETS = [
  { name: 'Conference room R2', uses: '24 bookings this month', tag: 'RES-R2' },
  { name: 'Transport Van AF-392', uses: '21 trips this month', tag: 'AF-0392' },
  { name: 'Projector Hub A', uses: '78 uses logged', tag: 'AF-0335' },
  { name: 'UX Design Lab Bench', uses: '19 bookings this month', tag: 'RES-UX' },
];

const IDLE_ASSETS = [
  { name: 'DSLR Camera AF-0301', idle: 'Unused 60+ days', tag: 'AF-0301' },
  { name: 'Extra Task Chair AF-0410', idle: 'Unused 45 days', tag: 'AF-0410' },
  { name: 'VR Headset Set 2', idle: 'Unused 38 days', tag: 'AF-0512' },
];

const RETIREMENT_ALERTS = [
  {
    tag: 'AF-0082',
    name: 'Heavy Duty Forklift',
    alert: 'Hydraulic service due in 5 days',
    type: 'maintenance',
  },
  {
    tag: 'AF-0020',
    name: 'Dell XPS 13 (2022)',
    alert: '4 years old — nearing retirement policy',
    type: 'retirement',
  },
  {
    tag: 'AF-0105',
    name: 'Lab Oscilloscope',
    alert: 'Annual NIST calibration due in 12 days',
    type: 'calibration',
  },
];

export default function ReportsPage() {
  const [exportToast, setExportToast] = useState(false);
  const [selectedRange, setSelectedRange] = useState('month');

  const handleExport = () => {
    setExportToast(true);
    setTimeout(() => setExportToast(false), 4000);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Reports & Analytics</h1>
          <p className={styles.subTitle}>
            Organization-wide inventory health, utilization rates, and preventative maintenance forecasts.
          </p>
        </div>
        <div className={styles.headerActions}>
          <select
            className={styles.rangeSelect}
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
          >
            <option value="month">This Month (July 2026)</option>
            <option value="quarter">Q3 2026</option>
            <option value="year">Year to Date (2026)</option>
          </select>
          <button
            className={styles.exportBtn}
            onClick={handleExport}
            id="export-report-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export Report
          </button>
        </div>
      </div>

      {exportToast && (
        <div className={styles.toast} id="export-success-toast">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Comprehensive inventory and utilization audit report generated & downloaded.
        </div>
      )}

      {/* Top 2 Visual Charts Grid (Screen 9 wireframe) */}
      <div className={styles.chartsGrid}>
        {/* Utilization by Department */}
        <div className={styles.chartCard} id="utilization-chart-card">
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Utilization by Department</span>
            <span className={styles.badgeSm}>Active %</span>
          </div>
          <div className={styles.barChartContainer}>
            {DEPT_UTILIZATION.map((item) => (
              <div key={item.dept} className={styles.barRow}>
                <div className={styles.barLabelGroup}>
                  <span className={styles.barDept}>{item.dept}</span>
                  <span className={styles.barVal}>{item.percentage}% ({item.allocated}/{item.total})</span>
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Frequency Trend */}
        <div className={styles.chartCard} id="maintenance-frequency-card">
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Maintenance Frequency</span>
            <span className={styles.badgeSm}>Monthly Incidents</span>
          </div>
          <div className={styles.trendContainer}>
            <div className={styles.trendBars}>
              {MAINTENANCE_TREND.map((item) => (
                <div key={item.month} className={styles.trendColumn}>
                  <span className={styles.trendVal}>{item.incidents}</span>
                  <div className={styles.trendBarTrack}>
                    <div
                      className={styles.trendBarFill}
                      style={{ height: `${(item.incidents / 12) * 100}%` }}
                    />
                  </div>
                  <span className={styles.trendMonth}>{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Insights Grid: Most Used, Idle, and Retirement Alerts (Screen 9 wireframe) */}
      <div className={styles.insightsGrid}>
        {/* Most Used Assets */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Most Used Assets</h3>
          <p className={styles.cardDesc}>High-frequency booking & utilization</p>
          <div className={styles.itemList}>
            {MOST_USED_ASSETS.map((a, idx) => (
              <div key={idx} className={styles.assetItem}>
                <div className={styles.itemIcon}>🔥</div>
                <div className={styles.itemContent}>
                  <span className={styles.itemName}>{a.name}</span>
                  <span className={styles.itemMeta}>{a.uses}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Idle Assets */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Idle Assets</h3>
          <p className={styles.cardDesc}>Candidate inventory for re-allocation</p>
          <div className={styles.itemList}>
            {IDLE_ASSETS.map((a, idx) => (
              <div key={idx} className={styles.assetItem}>
                <div className={styles.itemIcon}>💤</div>
                <div className={styles.itemContent}>
                  <span className={styles.itemName}>{a.name}</span>
                  <span className={styles.itemMeta}>{a.idle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assets Due for Maintenance / Nearing Retirement */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Maintenance & Retirement Due</h3>
          <p className={styles.cardDesc}>Upcoming service milestones & lifecycles</p>
          <div className={styles.itemList}>
            {RETIREMENT_ALERTS.map((a, idx) => (
              <div key={idx} className={styles.assetItem}>
                <div className={styles.itemIcon}>
                  {a.type === 'maintenance' ? '⚠️' : a.type === 'retirement' ? '⏳' : '🔍'}
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.itemTopLine}>
                    <span className={styles.itemTag}>{a.tag}</span>
                    <span className={styles.itemName}>{a.name}</span>
                  </div>
                  <span className={styles.itemAlert}>{a.alert}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
