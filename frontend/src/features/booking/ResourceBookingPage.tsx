import { useState } from 'react';
import styles from './ResourceBookingPage.module.css';

interface Booking {
  id: string;
  resourceId: string;
  startTime: string; // e.g. '09:00'
  endTime: string;   // e.g. '10:00'
  title: string;
  bookedBy: string;
  department: string;
  status: 'confirmed' | 'conflict';
  conflictReason?: string;
}

const RESOURCES = [
  { id: 'conf-r2', name: 'Conference room R2 - HQ Floor 2', capacity: '12 people' },
  { id: 'conf-r1', name: 'Conference room R1 - HQ Floor 1', capacity: '8 people' },
  { id: 'exec-board', name: 'Executive Boardroom - HQ Floor 4', capacity: '20 people' },
  { id: 'design-lab', name: 'UX Design Lab - Floor 3', capacity: '10 people' },
  { id: 'projector-a', name: 'Portable Projector Hub A', capacity: 'Equipment' },
];

const TIME_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    resourceId: 'conf-r2',
    startTime: '09:00',
    endTime: '10:00',
    title: 'Booked - Procurement Team - 9 to 10',
    bookedBy: 'Sarah Jenkins',
    department: 'Procurement',
    status: 'confirmed',
  },
  {
    id: 'b2',
    resourceId: 'conf-r2',
    startTime: '10:00',
    endTime: '11:00',
    title: 'Requested 9:30 to 10:30 : conflict - slot 2 unavailable',
    bookedBy: 'Aditi Rao',
    department: 'Engineering',
    status: 'conflict',
    conflictReason: 'Overlaps with 09:00–10:00 Procurement Team booking.',
  },
  {
    id: 'b3',
    resourceId: 'conf-r2',
    startTime: '13:00',
    endTime: '14:00',
    title: 'Booked - Engineering Sprint Review - 1 to 2',
    bookedBy: 'Arjun Nair',
    department: 'Engineering',
    status: 'confirmed',
  },
];

export default function ResourceBookingPage() {
  const [selectedResource, setSelectedResource] = useState('conf-r2');
  const [selectedDate, setSelectedDate] = useState('2026-07-08'); // Tue, 8 Jul
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [modalStartTime, setModalStartTime] = useState('11:00');
  const [modalEndTime, setModalEndTime] = useState('12:00');
  const [modalTitle, setModalTitle] = useState('');
  const [modalBookedBy, setModalBookedBy] = useState('Priya Shah');
  const [modalDept, setModalDept] = useState('Engineering');
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const activeResource =
    RESOURCES.find((r) => r.id === selectedResource) || RESOURCES[0];

  const currentBookings = bookings.filter(
    (b) => b.resourceId === selectedResource
  );

  const checkConflict = (start: string, end: string) => {
    const startNum = parseInt(start.split(':')[0], 10);
    const endNum = parseInt(end.split(':')[0], 10);

    const hasOverlap = currentBookings.some((b) => {
      if (b.status !== 'confirmed') return false;
      const bStart = parseInt(b.startTime.split(':')[0], 10);
      const bEnd = parseInt(b.endTime.split(':')[0], 10);
      return startNum < bEnd && endNum > bStart;
    });

    return hasOverlap;
  };

  const handleOpenModal = (slotHour?: string) => {
    if (slotHour) {
      const nextHour = (parseInt(slotHour.split(':')[0], 10) + 1)
        .toString()
        .padStart(2, '0') + ':00';
      setModalStartTime(slotHour);
      setModalEndTime(nextHour);
    }
    setModalTitle('');
    setConflictWarning(null);
    setIsModalOpen(true);
  };

  const handleTimeChange = (start: string, end: string) => {
    setModalStartTime(start);
    setModalEndTime(end);
    if (checkConflict(start, end)) {
      setConflictWarning(
        `Time conflict detected: Slot overlaps with an existing confirmed reservation.`
      );
    } else {
      setConflictWarning(null);
    }
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim()) return;

    const isConflict = checkConflict(modalStartTime, modalEndTime);

    const newBooking: Booking = {
      id: Date.now().toString(),
      resourceId: selectedResource,
      startTime: modalStartTime,
      endTime: modalEndTime,
      title: isConflict
        ? `Requested ${modalStartTime} to ${modalEndTime} : conflict - slot unavailable`
        : `Booked - ${modalTitle} - ${modalStartTime} to ${modalEndTime}`,
      bookedBy: modalBookedBy,
      department: modalDept,
      status: isConflict ? 'conflict' : 'confirmed',
      conflictReason: isConflict
        ? 'Overlaps with another confirmed booking in this timeframe.'
        : undefined,
    };

    setBookings([...bookings, newBooking]);
    setIsModalOpen(false);
  };

  const formatHourLabel = (timeStr: string) => {
    const hour = parseInt(timeStr.split(':')[0], 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:00 ${ampm}`;
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Resource Booking</h1>
          <p className={styles.subTitle}>
            Schedule shared meeting rooms, AV equipment, and collaborative resources.
          </p>
        </div>
        <button
          className={styles.bookBtn}
          onClick={() => handleOpenModal()}
          id="open-booking-modal-btn"
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
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Book a slot
        </button>
      </div>

      {/* Resource & Date Selector Card (Screen 6 wireframe) */}
      <div className={styles.selectorCard}>
        <div className={styles.selectorRow}>
          <div className={styles.selectGroup}>
            <label className={styles.selectorLabel} htmlFor="resource-select">
              Resource
            </label>
            <select
              id="resource-select"
              className={styles.resourceSelect}
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
            >
              {RESOURCES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.capacity})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.dateGroup}>
            <label className={styles.selectorLabel} htmlFor="date-input">
              Date
            </label>
            <input
              type="date"
              id="date-input"
              className={styles.dateInput}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.resourceSummary}>
          <span className={styles.summaryBadge}>Active Resource</span>
          <span className={styles.summaryTitle}>{activeResource.name}</span>
          <span className={styles.summaryCap}>• {activeResource.capacity}</span>
        </div>
      </div>

      {/* Time-Slot Timeline Grid (Screen 6 wireframe) */}
      <div className={styles.timelineCard}>
        <div className={styles.timelineHeader}>
          <span className={styles.timelineTitle}>
            Daily Schedule Timeline • Tue, 8 Jul
          </span>
          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.legendConfirmed}`} />
              Confirmed Booking
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.legendConflict}`} />
              Conflict / Blocked
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.legendAvailable}`} />
              Available
            </span>
          </div>
        </div>

        <div className={styles.timelineBody} id="booking-timeline">
          {TIME_SLOTS.map((slot) => {
            const matchedBookings = currentBookings.filter(
              (b) => b.startTime === slot
            );

            return (
              <div key={slot} className={styles.timeRow}>
                {/* Time Label */}
                <div className={styles.timeLabel}>{formatHourLabel(slot)}</div>

                {/* Slot Content Area */}
                <div className={styles.slotTrack}>
                  {matchedBookings.length > 0 ? (
                    matchedBookings.map((b) => (
                      <div
                        key={b.id}
                        className={`${styles.bookingBlock} ${
                          b.status === 'confirmed'
                            ? styles.confirmedBlock
                            : styles.conflictBlock
                        }`}
                      >
                        <div className={styles.blockHeader}>
                          <span className={styles.blockTitle}>{b.title}</span>
                          <span className={styles.blockBadge}>
                            {b.status === 'confirmed' ? 'CONFIRMED' : 'CONFLICT'}
                          </span>
                        </div>
                        <div className={styles.blockMeta}>
                          <span>Organizer: {b.bookedBy}</span>
                          <span>• Dept: {b.department}</span>
                          {b.conflictReason && (
                            <span className={styles.conflictDetail}>
                              ⚠️ {b.conflictReason}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <button
                      className={styles.availableSlot}
                      onClick={() => handleOpenModal(slot)}
                    >
                      <span className={styles.availableText}>
                        + Available — Click to reserve {formatHourLabel(slot)}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Book a Slot Modal */}
      {isModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsModalOpen(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            id="book-slot-modal"
          >
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Book a Resource Slot</h2>
                <p className={styles.modalSubtitle}>{activeResource.name}</p>
              </div>
              <button
                className={styles.closeModalBtn}
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className={styles.modalForm}>
              {conflictWarning && (
                <div className={styles.modalConflictAlert} id="modal-conflict-warning">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{conflictWarning}</span>
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.label}>Booking Purpose / Title *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="e.g. Q3 Budget Review & Vendor Pitch"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  id="booking-title-input"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Start Time</label>
                  <select
                    className={styles.select}
                    value={modalStartTime}
                    onChange={(e) => handleTimeChange(e.target.value, modalEndTime)}
                    id="booking-start-time"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {formatHourLabel(t)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>End Time</label>
                  <select
                    className={styles.select}
                    value={modalEndTime}
                    onChange={(e) => handleTimeChange(modalStartTime, e.target.value)}
                    id="booking-end-time"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {formatHourLabel(t)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Organizer Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={modalBookedBy}
                    onChange={(e) => setModalBookedBy(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Department</label>
                  <select
                    className={styles.select}
                    value={modalDept}
                    onChange={(e) => setModalDept(e.target.value)}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Facilities">Facilities</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
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
                  id="confirm-booking-btn"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
