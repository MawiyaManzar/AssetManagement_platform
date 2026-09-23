import { useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import styles from './OrganizationSetupPage.module.css';

/* ── Tab definitions ── */
const TABS = [
  { id: 'departments', label: 'Departments' },
  { id: 'categories',  label: 'Categories' },
  { id: 'employee',    label: 'Employee' },
];

/* ── Mock department data ── */
const DEPARTMENTS = [
  { id: '1', name: 'Engineering',     head: 'aditi rao',   parentDept: '—',        status: 'active' as const },
  { id: '2', name: 'Facilities',      head: 'rohan mehta', parentDept: '—',        status: 'active' as const },
  { id: '3', name: 'Field ops (east)', head: 'sana iqbal', parentDept: 'Field Ops', status: 'inactive' as const },
];

const CATEGORIES = [
  { id: '1', name: 'Electronics',  code: 'ELEC',   assetCount: 85, status: 'active' as const },
  { id: '2', name: 'Furniture',    code: 'FURN',   assetCount: 42, status: 'active' as const },
  { id: '3', name: 'Vehicles',     code: 'VEH',    assetCount: 12, status: 'active' as const },
  { id: '4', name: 'Stationery',   code: 'STAT',   assetCount: 0,  status: 'inactive' as const },
];

const EMPLOYEES = [
  { id: '1', name: 'Aditi Rao',     email: 'aditi@company.com',  department: 'Engineering', role: 'Department Head', status: 'active' as const },
  { id: '2', name: 'Rohan Mehta',   email: 'rohan@company.com',  department: 'Facilities',  role: 'Department Head', status: 'active' as const },
  { id: '3', name: 'Sana Iqbal',    email: 'sana@company.com',   department: 'Field Ops',   role: 'Asset Manager',   status: 'active' as const },
  { id: '4', name: 'Priya Shah',    email: 'priya@company.com',  department: 'Engineering', role: 'Employee',        status: 'active' as const },
];

export default function OrganizationSetupPage() {
  const [activeTab, setActiveTab] = useState('departments');

  return (
    <div className={styles.page}>
      {/* Tabs header row */}
      <div className={styles.headerRow}>
        <div className={styles.tabList} role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
              id={`tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button className={styles.addBtn} id="org-add-btn">
          + Add
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent} role="tabpanel">
        {activeTab === 'departments' && (
          <>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Department</th>
                    <th className={styles.th}>Head</th>
                    <th className={styles.th}>Parent Dept</th>
                    <th className={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {DEPARTMENTS.map((dept) => (
                    <tr key={dept.id} className={styles.tr}>
                      <td className={styles.td}>
                        <span className={styles.deptName}>{dept.name}</span>
                      </td>
                      <td className={styles.td}>{dept.head}</td>
                      <td className={styles.td}>{dept.parentDept}</td>
                      <td className={styles.td}>
                        <Badge variant={dept.status === 'active' ? 'success' : 'error'} size="sm">
                          {dept.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className={styles.infoNote}>
              Editing a department here also drives the picklist in Screen 4 & 5
            </p>
          </>
        )}

        {activeTab === 'categories' && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Category</th>
                  <th className={styles.th}>Code</th>
                  <th className={styles.th}>Assets</th>
                  <th className={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map((cat) => (
                  <tr key={cat.id} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.deptName}>{cat.name}</span>
                    </td>
                    <td className={styles.td}>{cat.code}</td>
                    <td className={styles.td}>{cat.assetCount}</td>
                    <td className={styles.td}>
                      <Badge variant={cat.status === 'active' ? 'success' : 'error'} size="sm">
                        {cat.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'employee' && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Email</th>
                  <th className={styles.th}>Department</th>
                  <th className={styles.th}>Role</th>
                  <th className={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {EMPLOYEES.map((emp) => (
                  <tr key={emp.id} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.deptName}>{emp.name}</span>
                    </td>
                    <td className={styles.td}>{emp.email}</td>
                    <td className={styles.td}>{emp.department}</td>
                    <td className={styles.td}>{emp.role}</td>
                    <td className={styles.td}>
                      <Badge variant={emp.status === 'active' ? 'success' : 'error'} size="sm">
                        {emp.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
