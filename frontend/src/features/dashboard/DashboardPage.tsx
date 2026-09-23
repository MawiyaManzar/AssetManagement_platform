import { Link } from 'react-router-dom';
import styles from './DashboardPage.module.css';

/* ── Mock Data ── */
const STAT_CARDS = [
  { label: 'Available',          value: 128, variant: 'default' as const },
  { label: 'Allocated',          value: 26,  variant: 'primary' as const },
  { label: 'Available',          value: 4,   variant: 'default' as const },
  { label: 'Active Bookings',    value: 9,   variant: 'info'    as const },
  { label: 'Pending Transfers',  value: 3,   variant: 'warning' as const },
  { label: 'Upcoming returns',   value: 12,  variant: 'default' as const },
];

const RECENT_ACTIVITY = [
  { id: '1', text: 'Laptop AF-0114 – allocated to Priya Shah – IT dept' },
  { id: '2', text: 'Room B2 – booking confirmed – 2:00 to 3:00 PM' },
  { id: '3', text: 'Projector AF-0062 – maintenance resolved' },
];

export default function DashboardPage() {
  return (
    <div className={styles.page}>
      {/* Page Title */}
      <h1 className={styles.pageTitle}>Today's Overview</h1>

      {/* Stat Cards Grid */}
      <div className={styles.statsGrid}>
        {STAT_CARDS.map((stat, i) => (
          <div key={i} className={`${styles.statCard} ${styles[`stat_${stat.variant}`]}`}>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Alert Banner */}
      <div className={styles.alertBanner} id="overdue-alert">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span>3 assets overdue for return – flagged for follow-up</span>
      </div>

      {/* Quick Actions */}
      <div className={styles.actionsRow}>
        <Link to="/dashboard/assets" className={`${styles.actionBtn} ${styles.actionPrimary}`}>
          + register asset
        </Link>
        <Link to="/dashboard/booking" className={`${styles.actionBtn} ${styles.actionOutline}`}>
          Book resource
        </Link>
        <Link to="/dashboard/maintenance" className={`${styles.actionBtn} ${styles.actionOutline}`}>
          Raise requests
        </Link>
      </div>

      {/* Recent Activity */}
      <div className={styles.activitySection}>
        <h2 className={styles.sectionTitle}>Recent Activity</h2>
        <ul className={styles.activityList}>
          {RECENT_ACTIVITY.map((item) => (
            <li key={item.id} className={styles.activityItem}>
              <span className={styles.activityDot} />
              <span className={styles.activityText}>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
