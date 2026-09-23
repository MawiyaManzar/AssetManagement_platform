import { useState, useMemo } from 'react';
import styles from './NotificationsPage.module.css';

type FilterCategory = 'All' | 'Alerts' | 'Approvals' | 'Bookings';

interface NotificationItem {
  id: string;
  type: 'Alerts' | 'Approvals' | 'Bookings' | 'General';
  title: string;
  details: string;
  timeAgo: string;
  icon: string;
  read: boolean;
  priority?: 'normal' | 'high' | 'critical';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'Approvals',
    title: 'Laptop AF-0014 assigned to Priya Shah',
    details: 'IT Dept approved deployment of Dell Precision workstation.',
    timeAgo: '2m ago',
    icon: '💻',
    read: false,
    priority: 'normal',
  },
  {
    id: 'n2',
    type: 'Approvals',
    title: 'Maintenance request AF-0095 approved',
    details: 'Facilities team dispatched HVAC repair work order.',
    timeAgo: '12m ago',
    icon: '⚠️',
    read: false,
    priority: 'normal',
  },
  {
    id: 'n3',
    type: 'Bookings',
    title: 'Booking confirmed: Room R2, 2:00 to 3:00 PM',
    details: 'Procurement Strategy team meeting reservation is locked in.',
    timeAgo: '1h ago',
    icon: '📅',
    read: false,
    priority: 'normal',
  },
  {
    id: 'n4',
    type: 'Approvals',
    title: 'Transfer approved: AF-0012 to Facilities dept',
    details: 'Custody successfully handed over from Engineering to Rohan Mehta.',
    timeAgo: '3h ago',
    icon: '🔄',
    read: true,
    priority: 'normal',
  },
  {
    id: 'n5',
    type: 'Alerts',
    title: 'Overdue return: AF-0021 was due 3 days ago',
    details: 'Asset loan period expired on July 5. Flagged for follow-up.',
    timeAgo: '1d ago',
    icon: '🚨',
    read: false,
    priority: 'critical',
  },
  {
    id: 'n6',
    type: 'Alerts',
    title: 'Audit discrepancy flagged: AF-0048 damaged',
    details: 'Engineering Q3 physical audit logged vertical panel cracks on monitor.',
    timeAgo: '2d ago',
    icon: '📋',
    read: true,
    priority: 'high',
  },
];

const TABS: FilterCategory[] = ['All', 'Alerts', 'Approvals', 'Bookings'];

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<FilterCategory>('All');
  const [selectedItem, setSelectedItem] = useState<NotificationItem | null>(null);

  const filteredItems = useMemo(() => {
    if (activeTab === 'All') return items;
    return items.filter((item) => item.type === activeTab);
  }, [items, activeTab]);

  const unreadCount = useMemo(() => {
    return items.filter((i) => !i.read).length;
  }, [items]);

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const handleItemClick = (item: NotificationItem) => {
    setSelectedItem(item);
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, read: true } : i))
    );
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Activity Logs & Notifications</h1>
          <p className={styles.subTitle}>
            Chronological audit feed, lifecycle approvals, and critical alert events.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            className={styles.markReadBtn}
            onClick={handleMarkAllRead}
            id="mark-all-read-btn"
          >
            Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      {/* Filter Tabs (Screen 10 wireframe: All | Alerts | Approvals | Bookings) */}
      <div className={styles.tabsRow} id="notification-tabs">
        {TABS.map((tab) => {
          const count =
            tab === 'All'
              ? items.length
              : items.filter((i) => i.type === tab).length;

          return (
            <button
              key={tab}
              className={`${styles.tabBtn} ${
                activeTab === tab ? styles.tabBtnActive : ''
              }`}
              onClick={() => setActiveTab(tab)}
              id={`tab-${tab.toLowerCase()}`}
            >
              {tab}
              <span className={styles.tabBadge}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Activity Feed Card (Screen 10 wireframe) */}
      <div className={styles.feedCard} id="notifications-feed">
        {filteredItems.length === 0 ? (
          <div className={styles.emptyFeed}>
            No activity notifications in this category.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`${styles.feedItem} ${!item.read ? styles.unreadItem : ''}`}
              onClick={() => handleItemClick(item)}
            >
              <div className={styles.itemIcon}>{item.icon}</div>
              <div className={styles.itemMain}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemTitle}>{item.title}</span>
                  <span className={styles.itemTime}>{item.timeAgo}</span>
                </div>
                <div className={styles.itemDetails}>{item.details}</div>
              </div>
              {!item.read && <div className={styles.unreadDot} />}
            </div>
          ))
        )}
      </div>

      {/* Detail Inspect Modal */}
      {selectedItem && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setSelectedItem(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderTitle}>
                <span className={styles.modalIcon}>{selectedItem.icon}</span>
                <h2 className={styles.modalTitle}>{selectedItem.title}</h2>
              </div>
              <button
                className={styles.closeModalBtn}
                onClick={() => setSelectedItem(null)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Category:</span>
                <span className={styles.modalVal}>{selectedItem.type}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Timestamp:</span>
                <span className={styles.modalVal}>{selectedItem.timeAgo}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Audit Details:</span>
                <span className={styles.modalVal}>{selectedItem.details}</span>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.submitBtn}
                onClick={() => setSelectedItem(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
