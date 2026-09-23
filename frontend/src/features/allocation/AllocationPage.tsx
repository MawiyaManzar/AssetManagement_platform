import { useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import styles from './AllocationPage.module.css';

interface AssetOption {
  tag: string;
  name: string;
  category: string;
  status: 'Allocated' | 'Available';
  currentCustodian?: string;
  department?: string;
  history: Array<{
    date: string;
    action: string;
    details: string;
    type: 'allocation' | 'return' | 'transfer' | 'system';
  }>;
}

const ASSET_OPTIONS: AssetOption[] = [
  {
    tag: 'AF-0114',
    name: 'Dell Laptop',
    category: 'Electronics',
    status: 'Allocated',
    currentCustodian: 'Priya Shah',
    department: 'Engineering',
    history: [
      {
        date: 'Mar 12, 2026',
        action: 'Allocated to Priya Shah',
        details: 'Department: Engineering • Tag AF-0114',
        type: 'allocation',
      },
      {
        date: 'Jan 04, 2026',
        action: 'Returned by Arjun Nair',
        details: 'Condition: Good • Cleared IT audit check',
        type: 'return',
      },
      {
        date: 'Nov 15, 2025',
        action: 'Initial Procurement & Check-in',
        details: 'Added by IT Operations • Warranty active until 2028',
        type: 'system',
      },
    ],
  },
  {
    tag: 'AF-0012',
    name: 'Dell Precision 5570',
    category: 'Electronics',
    status: 'Allocated',
    currentCustodian: 'Aditi Rao',
    department: 'Engineering',
    history: [
      {
        date: 'Feb 10, 2026',
        action: 'Allocated to Aditi Rao',
        details: 'Engineering Team Lead Workstation',
        type: 'allocation',
      },
    ],
  },
  {
    tag: 'AF-0310',
    name: 'Hydraulic Forklift',
    category: 'Machinery',
    status: 'Allocated',
    currentCustodian: 'Tariq Ansari',
    department: 'Field Ops',
    history: [
      {
        date: 'Jan 22, 2026',
        action: 'Allocated to Tariq Ansari',
        details: 'Plant 1 Operations',
        type: 'allocation',
      },
    ],
  },
  {
    tag: 'AF-0201',
    name: 'Office Chair (Ergonomic)',
    category: 'Furniture',
    status: 'Available',
    history: [
      {
        date: 'Dec 01, 2025',
        action: 'Returned to Warehouse',
        details: 'Ready for re-assignment',
        type: 'return',
      },
    ],
  },
  {
    tag: 'AF-0415',
    name: 'MacBook Pro M3 Max',
    category: 'Electronics',
    status: 'Available',
    history: [
      {
        date: 'Mar 01, 2026',
        action: 'Unboxed & Configured',
        details: 'IT Dept Store • Ready for assignment',
        type: 'system',
      },
    ],
  },
];

const EMPLOYEES = [
  { name: 'Arjun Nair', dept: 'Engineering' },
  { name: 'Rohan Mehta', dept: 'Facilities' },
  { name: 'Zane Iqbal', dept: 'Field Ops' },
  { name: 'Sarah Jenkins', dept: 'Marketing' },
  { name: 'Kavita Patel', dept: 'Finance' },
];

export default function AllocationPage() {
  const [assetList, setAssetList] = useState<AssetOption[]>(ASSET_OPTIONS);
  const [selectedTag, setSelectedTag] = useState<string>('AF-0114');

  // Transfer Form State
  const [toEmployee, setToEmployee] = useState('');
  const [reason, setReason] = useState('');
  const [transferSubmitted, setTransferSubmitted] = useState(false);

  // Direct Allocation Form State (for available assets)
  const [assignEmployee, setAssignEmployee] = useState('');
  const [assignSuccess, setAssignSuccess] = useState(false);

  const selectedAsset = assetList.find((a) => a.tag === selectedTag) || assetList[0];

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmployee || !reason.trim()) return;

    const newHistoryEntry = {
      date: 'Just now',
      action: `Transfer requested: ${selectedAsset.currentCustodian} → ${toEmployee}`,
      details: `Reason: ${reason}`,
      type: 'transfer' as const,
    };

    setAssetList((prev) =>
      prev.map((a) =>
        a.tag === selectedAsset.tag
          ? { ...a, history: [newHistoryEntry, ...a.history] }
          : a
      )
    );

    setTransferSubmitted(true);
    setReason('');
    setTimeout(() => setTransferSubmitted(false), 5000);
  };

  const handleDirectAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignEmployee) return;

    const empObj = EMPLOYEES.find((emp) => emp.name === assignEmployee);
    const newHistoryEntry = {
      date: 'Just now',
      action: `Directly allocated to ${assignEmployee}`,
      details: `Department: ${empObj?.dept || 'General'}`,
      type: 'allocation' as const,
    };

    setAssetList((prev) =>
      prev.map((a) =>
        a.tag === selectedAsset.tag
          ? {
              ...a,
              status: 'Allocated',
              currentCustodian: assignEmployee,
              department: empObj?.dept || 'General',
              history: [newHistoryEntry, ...a.history],
            }
          : a
      )
    );

    setAssignSuccess(true);
    setTimeout(() => setAssignSuccess(false), 5000);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Asset Allocation & Transfer</h1>
          <p className={styles.subTitle}>
            Enforce double-allocation prevention and initiate audited custodian transfers.
          </p>
        </div>
      </div>

      {/* Asset Picker Card */}
      <div className={styles.assetPickerCard}>
        <div className={styles.pickerHeader}>
          <label className={styles.pickerLabel} htmlFor="asset-select">
            Select Asset to Allocate or Transfer
          </label>
          <div className={styles.assetSelectorWrapper}>
            <select
              id="asset-select"
              className={styles.assetSelect}
              value={selectedTag}
              onChange={(e) => {
                setSelectedTag(e.target.value);
                setTransferSubmitted(false);
                setAssignSuccess(false);
              }}
            >
              {assetList.map((a) => (
                <option key={a.tag} value={a.tag}>
                  {a.tag} — {a.name} ({a.status === 'Allocated' ? `Allocated to ${a.currentCustodian}` : 'Available'})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.assetMetaRow}>
          <div className={styles.metaItem}>
            <span className={styles.metaKey}>Asset Tag:</span>
            <span className={styles.metaMono}>{selectedAsset.tag}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaKey}>Asset Name:</span>
            <span className={styles.metaVal}>{selectedAsset.name}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaKey}>Category:</span>
            <span className={styles.metaVal}>{selectedAsset.category}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaKey}>Status:</span>
            <Badge variant={selectedAsset.status === 'Allocated' ? 'primary' : 'success'}>
              {selectedAsset.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Conditional Workflow based on allocation status */}
      {selectedAsset.status === 'Allocated' ? (
        <>
          {/* Double Allocation Warning Banner (Screen 5 wireframe) */}
          <div className={styles.alertBanner} id="double-allocation-alert">
            <div className={styles.alertIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className={styles.alertBody}>
              <strong className={styles.alertTitle}>
                Already Allocated to {selectedAsset.currentCustodian} ({selectedAsset.department || 'General'})
              </strong>
              <p className={styles.alertText}>
                Direct re-allocation is blocked — submit a transfer request below.
              </p>
            </div>
          </div>

          {/* Transfer Request Form */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Transfer Request</h2>
            <p className={styles.cardSubtitle}>
              Request custody handoff from the current holder to another employee.
            </p>

            {transferSubmitted && (
              <div className={styles.successToast} id="transfer-success-msg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Transfer request submitted successfully and logged to audit trail.
              </div>
            )}

            <form onSubmit={handleTransferSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>From (Current Custodian)</label>
                  <input
                    type="text"
                    readOnly
                    className={`${styles.input} ${styles.inputReadonly}`}
                    value={`${selectedAsset.currentCustodian} (${selectedAsset.department || 'Engineering'})`}
                    id="transfer-from-input"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="transfer-to-select">
                    To (New Custodian) *
                  </label>
                  <select
                    id="transfer-to-select"
                    required
                    className={styles.select}
                    value={toEmployee}
                    onChange={(e) => setToEmployee(e.target.value)}
                  >
                    <option value="">Select Employee...</option>
                    {EMPLOYEES.filter((emp) => emp.name !== selectedAsset.currentCustodian).map((emp) => (
                      <option key={emp.name} value={emp.name}>
                        {emp.name} ({emp.dept})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="transfer-reason">
                  Reason for Transfer *
                </label>
                <textarea
                  id="transfer-reason"
                  required
                  rows={3}
                  className={styles.textarea}
                  placeholder="e.g. Reassigned to Q3 Cloud Migration project under Arjun Nair..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  id="submit-transfer-btn"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        /* Direct Allocation Form for Available Assets */
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Direct Asset Allocation</h2>
          <p className={styles.cardSubtitle}>
            This asset is currently in storage. Assign it directly to an active employee.
          </p>

          {assignSuccess && (
            <div className={styles.successToast}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Asset successfully assigned to {selectedAsset.currentCustodian}!
            </div>
          )}

          <form onSubmit={handleDirectAssign} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="direct-assign-employee">
                  Assign To Employee *
                </label>
                <select
                  id="direct-assign-employee"
                  required
                  className={styles.select}
                  value={assignEmployee}
                  onChange={(e) => setAssignEmployee(e.target.value)}
                >
                  <option value="">Select Employee...</option>
                  {EMPLOYEES.map((emp) => (
                    <option key={emp.name} value={emp.name}>
                      {emp.name} ({emp.dept})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.submitBtn}
                id="direct-assign-btn"
              >
                Assign Asset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Allocation History Card (Screen 5 wireframe) */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Allocation History</h2>
        <div className={styles.historyList} id="allocation-history-list">
          {selectedAsset.history.map((item, idx) => (
            <div key={idx} className={styles.historyItem}>
              <div className={styles.historyDot} />
              <div className={styles.historyContent}>
                <div className={styles.historyTop}>
                  <span className={styles.historyDate}>{item.date}</span>
                  <span className={styles.historyAction}>{item.action}</span>
                </div>
                <div className={styles.historyDetails}>{item.details}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
