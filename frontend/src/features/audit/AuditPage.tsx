import { useState, useMemo } from 'react';
import styles from './AuditPage.module.css';

export type VerificationStatus = 'verified' | 'missing' | 'damaged' | 'unverified';

interface AuditItem {
  id: string;
  tag: string;
  name: string;
  expectedLocation: string;
  status: VerificationStatus;
  notes?: string;
}

const INITIAL_AUDIT_ITEMS: AuditItem[] = [
  {
    id: 'a1',
    tag: 'AF-0012',
    name: 'Dell Laptop',
    expectedLocation: 'Desk E12',
    status: 'verified',
  },
  {
    id: 'a2',
    tag: 'AF-0401',
    name: 'Office Chair',
    expectedLocation: 'Desk B04',
    status: 'missing',
    notes: 'Not found at assigned desk during 1st pass.',
  },
  {
    id: 'a3',
    tag: 'AF-9888',
    name: 'Dell 27" 4K Monitor',
    expectedLocation: 'Desk W10',
    status: 'damaged',
    notes: 'Display panel has vertical red lines.',
  },
  {
    id: 'a4',
    tag: 'AF-0114',
    name: 'Dell Precision Workstation',
    expectedLocation: 'Lab 3 - Workbench 2',
    status: 'verified',
  },
  {
    id: 'a5',
    tag: 'AF-0310',
    name: 'Hydraulic Forklift',
    expectedLocation: 'Plant 1 - Yard',
    status: 'verified',
  },
];

export default function AuditPage() {
  const [items, setItems] = useState<AuditItem[]>(INITIAL_AUDIT_ITEMS);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'flagged'>('all');

  const handleStatusChange = (id: string, newStatus: VerificationStatus) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const flaggedCount = useMemo(() => {
    return items.filter(
      (item) => item.status === 'missing' || item.status === 'damaged'
    ).length;
  }, [items]);

  const verifiedCount = useMemo(() => {
    return items.filter((item) => item.status === 'verified').length;
  }, [items]);

  const displayedItems = useMemo(() => {
    if (filter === 'flagged') {
      return items.filter(
        (i) => i.status === 'missing' || i.status === 'damaged'
      );
    }
    return items;
  }, [items, filter]);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Asset Audit</h1>
          <p className={styles.subTitle}>
            Perform periodic physical inventory audits and auto-flag discrepancies.
          </p>
        </div>
      </div>

      {/* Audit Cycle Details Banner (Screen 8 wireframe) */}
      <div className={styles.cycleBanner}>
        <div className={styles.cycleTop}>
          <div className={styles.cycleInfo}>
            <span className={styles.cycleBadge}>Active Audit Cycle</span>
            <span className={styles.cycleTitle}>
              Q3 Audit: Engineering dept — 1-15 Jul
            </span>
          </div>
          <div className={styles.auditorMeta}>
            Auditors: <strong>A. Rao</strong>, <strong>Z. Iqbal</strong>
          </div>
        </div>

        <div className={styles.progressRow}>
          <div className={styles.progressBarWrapper}>
            <div
              className={styles.progressBar}
              style={{
                width: `${(verifiedCount / items.length) * 100}%`,
              }}
            />
          </div>
          <span className={styles.progressText}>
            {verifiedCount} of {items.length} verified ({Math.round((verifiedCount / items.length) * 100)}%)
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.tabFilterRow}>
        <button
          className={`${styles.tabBtn} ${filter === 'all' ? styles.tabBtnActive : ''}`}
          onClick={() => setFilter('all')}
        >
          All Items ({items.length})
        </button>
        <button
          className={`${styles.tabBtn} ${filter === 'flagged' ? styles.tabBtnActive : ''}`}
          onClick={() => setFilter('flagged')}
        >
          Flagged Discrepancies ({flaggedCount})
        </button>
      </div>

      {/* Checklist Table (Screen 8 wireframe) */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table} id="audit-checklist-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Expected Location</th>
                <th>Verification</th>
              </tr>
            </thead>
            <tbody>
              {displayedItems.map((item) => (
                <tr key={item.id} className={styles.tableRow}>
                  <td>
                    <div className={styles.assetCell}>
                      <span className={styles.tagBadge}>{item.tag}</span>
                      <span className={styles.assetName}>{item.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.locationCell}>{item.expectedLocation}</span>
                  </td>
                  <td>
                    <div className={styles.btnGroup}>
                      <button
                        className={`${styles.statusBtn} ${styles.verifiedBtn} ${
                          item.status === 'verified' ? styles.activeVerified : ''
                        }`}
                        onClick={() => handleStatusChange(item.id, 'verified')}
                        title="Mark Verified"
                      >
                        Verified
                      </button>
                      <button
                        className={`${styles.statusBtn} ${styles.missingBtn} ${
                          item.status === 'missing' ? styles.activeMissing : ''
                        }`}
                        onClick={() => handleStatusChange(item.id, 'missing')}
                        title="Mark Missing"
                      >
                        Missing
                      </button>
                      <button
                        className={`${styles.statusBtn} ${styles.damagedBtn} ${
                          item.status === 'damaged' ? styles.activeDamaged : ''
                        }`}
                        onClick={() => handleStatusChange(item.id, 'damaged')}
                        title="Mark Damaged"
                      >
                        Damaged
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Discrepancy Report Banner & Action (Screen 8 wireframe) */}
      {flaggedCount > 0 && (
        <div className={styles.discrepancyBox} id="audit-discrepancy-banner">
          <div className={styles.discrepancyText}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>
              <strong>{flaggedCount} assets flagged</strong> — discrepancy report generated automatically.
            </span>
          </div>
        </div>
      )}

      {/* Close Audit Cycle Button */}
      <div className={styles.actionRow}>
        <button
          className={styles.closeCycleBtn}
          onClick={() => setIsCompletedModalOpen(true)}
          id="close-audit-cycle-btn"
        >
          Close audit cycle
        </button>
      </div>

      {/* Summary / Close Cycle Modal */}
      {isCompletedModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsCompletedModalOpen(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            id="audit-summary-modal"
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Audit Cycle Summary Report</h2>
              <button
                className={styles.closeModalBtn}
                onClick={() => setIsCompletedModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalDesc}>
                Q3 Audit for <strong>Engineering Dept</strong> is ready to be finalized.
              </p>
              <div className={styles.summaryMetrics}>
                <div className={styles.metricBox}>
                  <span className={styles.metricVal}>{items.length}</span>
                  <span className={styles.metricLbl}>Total Items</span>
                </div>
                <div className={`${styles.metricBox} ${styles.metricSuccess}`}>
                  <span className={styles.metricVal}>{verifiedCount}</span>
                  <span className={styles.metricLbl}>Verified</span>
                </div>
                <div className={`${styles.metricBox} ${styles.metricDanger}`}>
                  <span className={styles.metricVal}>{flaggedCount}</span>
                  <span className={styles.metricLbl}>Flagged Discrepancies</span>
                </div>
              </div>
              <p className={styles.auditNote}>
                Audit findings will be logged to system activity and sent to department head <strong>Aditi Rao</strong>.
              </p>
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsCompletedModalOpen(false)}
              >
                Keep Open
              </button>
              <button
                className={styles.submitBtn}
                onClick={() => {
                  alert('Audit cycle closed successfully! Discrepancy report archived.');
                  setIsCompletedModalOpen(false);
                }}
              >
                Finalize & Archive Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
