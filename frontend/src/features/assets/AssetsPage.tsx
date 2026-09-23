import { useState, useMemo } from 'react';
import { Badge } from '../../components/ui/Badge';
import styles from './AssetsPage.module.css';

interface Asset {
  id: string;
  tag: string;
  name: string;
  category: string;
  status: 'Allocated' | 'Maintenance' | 'Available' | 'Retired';
  department: string;
  location: string;
  serialNumber: string;
  custodian?: string;
}

const INITIAL_ASSETS: Asset[] = [
  {
    id: '1',
    tag: 'AF-0012',
    name: 'Dell Laptop',
    category: 'Electronics',
    status: 'Allocated',
    department: 'Engineering',
    location: 'Bangalore',
    serialNumber: 'DL-99281-ENG',
    custodian: 'Priya Shah',
  },
  {
    id: '2',
    tag: 'AF-0062',
    name: 'Projector',
    category: 'Electronics',
    status: 'Maintenance',
    department: 'Facilities',
    location: 'HQ Floor 2',
    serialNumber: 'PJ-4412-FAC',
    custodian: 'HQ AV Team',
  },
  {
    id: '3',
    tag: 'AF-0201',
    name: 'Office Chair',
    category: 'Furniture',
    status: 'Available',
    department: 'Operations',
    location: 'Warehouse',
    serialNumber: 'CH-8812-WRH',
  },
  {
    id: '4',
    tag: 'AF-0114',
    name: 'Dell Precision 5570',
    category: 'Electronics',
    status: 'Allocated',
    department: 'Engineering',
    location: 'Bangalore - Lab 3',
    serialNumber: 'DL-0114-ENG',
    custodian: 'Priya Shah',
  },
  {
    id: '5',
    tag: 'AF-0310',
    name: 'Hydraulic Forklift',
    category: 'Machinery',
    status: 'Allocated',
    department: 'Field Ops',
    location: 'Plant 1 - Yard',
    serialNumber: 'FK-3391-OPS',
    custodian: 'Tariq Ansari',
  },
  {
    id: '6',
    tag: 'AF-0415',
    name: 'MacBook Pro M3 Max',
    category: 'Electronics',
    status: 'Available',
    department: 'Engineering',
    location: 'IT Dept Store',
    serialNumber: 'MB-5520-ENG',
  },
  {
    id: '7',
    tag: 'AF-0550',
    name: 'Ergonomic Standing Desk',
    category: 'Furniture',
    status: 'Available',
    department: 'Facilities',
    location: 'HQ Floor 3',
    serialNumber: 'DK-1049-FAC',
  },
];

const CATEGORIES = ['All Categories', 'Electronics', 'Furniture', 'Machinery', 'Vehicles'];
const STATUSES = ['All Statuses', 'Available', 'Allocated', 'Maintenance', 'Retired'];
const DEPARTMENTS = ['All Departments', 'Engineering', 'Facilities', 'Field Ops', 'Operations'];

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Form State for new asset
  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    category: 'Electronics',
    status: 'Available' as Asset['status'],
    department: 'Engineering',
    location: '',
    serialNumber: '',
  });

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        asset.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        categoryFilter === 'All Categories' || asset.category === categoryFilter;
      const matchesStatus =
        statusFilter === 'All Statuses' || asset.status === statusFilter;
      const matchesDept =
        deptFilter === 'All Departments' || asset.department === deptFilter;

      return matchesSearch && matchesCat && matchesStatus && matchesDept;
    });
  }, [assets, searchQuery, categoryFilter, statusFilter, deptFilter]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.tag) return;

    const newAsset: Asset = {
      id: Date.now().toString(),
      tag: formData.tag.trim().toUpperCase(),
      name: formData.name.trim(),
      category: formData.category,
      status: formData.status,
      department: formData.department,
      location: formData.location.trim() || 'HQ Central Store',
      serialNumber: formData.serialNumber.trim() || `SN-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setAssets([newAsset, ...assets]);
    setIsModalOpen(false);
    setFormData({
      name: '',
      tag: '',
      category: 'Electronics',
      status: 'Available',
      department: 'Engineering',
      location: '',
      serialNumber: '',
    });
  };

  const getStatusVariant = (status: Asset['status']) => {
    switch (status) {
      case 'Available':
        return 'success';
      case 'Allocated':
        return 'primary';
      case 'Maintenance':
        return 'warning';
      case 'Retired':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  return (
    <div className={styles.page}>
      {/* Header bar */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Asset Registrations & Directory</h1>
          <p className={styles.subTitle}>
            Manage and track all organizational hardware, equipment, and resources.
          </p>
        </div>
        <button
          className={styles.registerBtn}
          onClick={() => {
            setFormData((prev) => ({
              ...prev,
              tag: `AF-${Math.floor(1000 + Math.random() * 9000)}`,
            }));
            setIsModalOpen(true);
          }}
          id="register-asset-btn"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          + Register Asset
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className={styles.controlsBar}>
        <div className={styles.searchWrapper}>
          <svg
            className={styles.searchIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by tag, serial, or QR code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="asset-search-input"
          />
          {searchQuery && (
            <button
              className={styles.clearSearchBtn}
              onClick={() => setSearchQuery('')}
            >
              ×
            </button>
          )}
        </div>

        <div className={styles.filterGroup}>
          <select
            className={styles.filterSelect}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            id="category-filter-select"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            id="status-filter-select"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            id="department-filter-select"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableStats}>
          Showing <strong>{filteredAssets.length}</strong> of{' '}
          <strong>{assets.length}</strong> assets
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table} id="assets-directory-table">
            <thead>
              <tr>
                <th>Tag</th>
                <th>Name</th>
                <th>Category</th>
                <th>Department</th>
                <th>Status</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyCell}>
                    No assets found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className={styles.tableRow}
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <td>
                      <span className={styles.tagBadge}>{asset.tag}</span>
                    </td>
                    <td>
                      <div className={styles.nameCell}>
                        <span className={styles.assetName}>{asset.name}</span>
                        <span className={styles.serialNumber}>
                          {asset.serialNumber}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.categoryCell}>{asset.category}</span>
                    </td>
                    <td>
                      <span className={styles.deptCell}>{asset.department}</span>
                    </td>
                    <td>
                      <Badge variant={getStatusVariant(asset.status)}>
                        {asset.status}
                      </Badge>
                    </td>
                    <td>
                      <span className={styles.locationCell}>{asset.location}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Asset Modal */}
      {isModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsModalOpen(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            id="register-modal"
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Register New Asset</h2>
              <button
                className={styles.closeModalBtn}
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleRegister} className={styles.modalForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Asset Tag *</label>
                  <input
                    type="text"
                    required
                    className={styles.input}
                    value={formData.tag}
                    onChange={(e) =>
                      setFormData({ ...formData, tag: e.target.value })
                    }
                    placeholder="e.g. AF-0941"
                    id="modal-asset-tag"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Serial Number</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.serialNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, serialNumber: e.target.value })
                    }
                    placeholder="e.g. SN-88301"
                    id="modal-asset-serial"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Asset Name *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. ThinkPad X1 Carbon Gen 11"
                  id="modal-asset-name"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <select
                    className={styles.select}
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Machinery">Machinery</option>
                    <option value="Vehicles">Vehicles</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Department</label>
                  <select
                    className={styles.select}
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Facilities">Facilities</option>
                    <option value="Field Ops">Field Ops</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Location</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g. Bangalore - 4th Floor IT Desk"
                  id="modal-asset-location"
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  id="modal-submit-btn"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Asset Detail Preview Drawer / Modal */}
      {selectedAsset && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setSelectedAsset(null)}
        >
          <div
            className={styles.detailModal}
            onClick={(e) => e.stopPropagation()}
            id="asset-detail-card"
          >
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.tagBadge}>{selectedAsset.tag}</span>
                <h2 className={styles.detailTitle}>{selectedAsset.name}</h2>
              </div>
              <button
                className={styles.closeModalBtn}
                onClick={() => setSelectedAsset(null)}
              >
                ×
              </button>
            </div>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Status</span>
                <Badge variant={getStatusVariant(selectedAsset.status)}>
                  {selectedAsset.status}
                </Badge>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Category</span>
                <span className={styles.detailValue}>
                  {selectedAsset.category}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Department</span>
                <span className={styles.detailValue}>
                  {selectedAsset.department}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Location</span>
                <span className={styles.detailValue}>
                  {selectedAsset.location}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Serial Number</span>
                <span className={styles.detailValue}>
                  {selectedAsset.serialNumber}
                </span>
              </div>
              {selectedAsset.custodian && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Assigned Custodian</span>
                  <span className={styles.detailValue}>
                    {selectedAsset.custodian}
                  </span>
                </div>
              )}
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.submitBtn}
                onClick={() => setSelectedAsset(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
