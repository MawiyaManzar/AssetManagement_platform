import { useState } from 'react';
import styles from './MaintenancePage.module.css';

export type MaintenanceStage =
  | 'pending'
  | 'approved'
  | 'technician_assigned'
  | 'in_progress'
  | 'resolved';

interface MaintenanceCard {
  id: string;
  assetTag: string;
  assetName: string;
  issue: string;
  stage: MaintenanceStage;
  priority: 'low' | 'medium' | 'high' | 'critical';
  reportedBy: string;
  department: string;
  assignedTechnician?: string;
  resolvedDate?: string;
}

const COLUMNS: { id: MaintenanceStage; label: string; countColor: string }[] = [
  { id: 'pending', label: 'Pending', countColor: '#E2E8F0' },
  { id: 'approved', label: 'Approved', countColor: '#E9D8FD' },
  { id: 'technician_assigned', label: 'Technician assigned', countColor: '#EBF8FF' },
  { id: 'in_progress', label: 'In progress', countColor: '#FEFCBF' },
  { id: 'resolved', label: 'Resolved', countColor: '#C6F6D5' },
];

const INITIAL_CARDS: MaintenanceCard[] = [
  {
    id: 'm1',
    assetTag: 'AF-0062',
    assetName: 'HD Laser Projector',
    issue: 'Projector bulb not turning on',
    stage: 'pending',
    priority: 'high',
    reportedBy: 'Aditi Rao',
    department: 'Engineering',
  },
  {
    id: 'm2',
    assetTag: 'AF-0112',
    assetName: 'HVAC AC Unit - Floor 2',
    issue: 'AC unit noisy compressor & cooling drop',
    stage: 'approved',
    priority: 'medium',
    reportedBy: 'Rohan Mehta',
    department: 'Facilities',
  },
  {
    id: 'm3',
    assetTag: 'AF-0078',
    assetName: 'Forklift Model X',
    issue: 'Forklift brake & servo hydraulic pressure low',
    stage: 'technician_assigned',
    priority: 'critical',
    reportedBy: 'Zane Iqbal',
    department: 'Field Ops',
    assignedTechnician: 'Apex Servo Diagnostics',
  },
  {
    id: 'm4',
    assetTag: 'AF-892',
    assetName: 'Office Heavy Duty Printer',
    issue: 'Printer jam parts ordered from OEM',
    stage: 'in_progress',
    priority: 'medium',
    reportedBy: 'Priya Shah',
    department: 'Engineering',
    assignedTechnician: 'Canon Support Desk',
  },
  {
    id: 'm5',
    assetTag: 'AF-0201',
    assetName: 'Ergonomic Office Chair',
    issue: 'Chair height cylinder repaired & tested',
    stage: 'resolved',
    priority: 'low',
    reportedBy: 'Sarah Jenkins',
    department: 'Marketing',
    assignedTechnician: 'HQ Maintenance Crew',
    resolvedDate: 'Resolved 7 Jul',
  },
];

export default function MaintenancePage() {
  const [cards, setCards] = useState<MaintenanceCard[]>(INITIAL_CARDS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<MaintenanceCard | null>(null);

  // New ticket form
  const [formTag, setFormTag] = useState('');
  const [formName, setFormName] = useState('');
  const [formIssue, setFormIssue] = useState('');
  const [formPriority, setFormPriority] = useState<MaintenanceCard['priority']>('medium');
  const [formDept, setFormDept] = useState('Engineering');

  const handleStageChange = (cardId: string, newStage: MaintenanceStage) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        return {
          ...c,
          stage: newStage,
          resolvedDate: newStage === 'resolved' ? `Resolved ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : c.resolvedDate,
        };
      })
    );
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTag || !formIssue) return;

    const newTicket: MaintenanceCard = {
      id: Date.now().toString(),
      assetTag: formTag.trim().toUpperCase(),
      assetName: formName.trim() || 'General Asset Item',
      issue: formIssue.trim(),
      stage: 'pending',
      priority: formPriority,
      reportedBy: 'Priya Shah',
      department: formDept,
    };

    setCards([...cards, newTicket]);
    setIsModalOpen(false);
    setFormTag('');
    setFormName('');
    setFormIssue('');
    setFormPriority('medium');
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Maintenance Management</h1>
          <p className={styles.subTitle}>
            Approval workflow & repair lifecycle tracking as an interactive Kanban board.
          </p>
        </div>
        <button
          className={styles.requestBtn}
          onClick={() => setIsModalOpen(true)}
          id="open-request-maintenance-btn"
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
          + Request Maintenance
        </button>
      </div>

      {/* Board Info Notice (Screen 7 wireframe note) */}
      <div className={styles.ruleNotice}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>
          <strong>Workflow rule:</strong> Approving a card moves the asset to <em>Under Maintenance</em>. Resolving returns it to <em>Available</em>.
        </span>
      </div>

      {/* Kanban Board (5 Columns) */}
      <div className={styles.kanbanBoard} id="maintenance-kanban-board">
        {COLUMNS.map((col) => {
          const colCards = cards.filter((c) => c.stage === col.id);

          return (
            <div key={col.id} className={styles.column} id={`col-${col.id}`}>
              <div className={styles.columnHeader}>
                <span className={styles.columnTitle}>{col.label}</span>
                <span className={styles.columnCount}>{colCards.length}</span>
              </div>

              <div className={styles.cardList}>
                {colCards.length === 0 ? (
                  <div className={styles.emptyCol}>No active tickets</div>
                ) : (
                  colCards.map((card) => (
                    <div
                      key={card.id}
                      className={`${styles.card} ${
                        card.stage === 'resolved' ? styles.resolvedCard : ''
                      }`}
                      onClick={() => setSelectedCard(card)}
                    >
                      <div className={styles.cardTop}>
                        <span className={styles.cardTag}>{card.assetTag}</span>
                        <span className={`${styles.priorityTag} ${styles[card.priority]}`}>
                          {card.priority}
                        </span>
                      </div>

                      <div className={styles.cardAssetName}>{card.assetName}</div>
                      <div className={styles.cardIssue}>{card.issue}</div>

                      {card.assignedTechnician && (
                        <div className={styles.cardTech}>
                          🔧 {card.assignedTechnician}
                        </div>
                      )}

                      {card.resolvedDate && (
                        <div className={styles.cardResolvedDate}>
                          ✅ {card.resolvedDate}
                        </div>
                      )}

                      {/* Quick stage mover */}
                      <div
                        className={styles.cardActions}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          className={styles.stageSelect}
                          value={card.stage}
                          onChange={(e) =>
                            handleStageChange(
                              card.id,
                              e.target.value as MaintenanceStage
                            )
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="technician_assigned">Tech Assigned</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Maintenance Request Modal */}
      {isModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsModalOpen(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            id="maintenance-request-modal"
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Request Asset Maintenance</h2>
              <button
                className={styles.closeModalBtn}
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateTicket} className={styles.modalForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Asset Tag *</label>
                  <input
                    type="text"
                    required
                    className={styles.input}
                    placeholder="e.g. AF-0062"
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    id="ticket-asset-tag"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Asset Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Projector Hub A"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    id="ticket-asset-name"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Issue Description *</label>
                <textarea
                  required
                  rows={3}
                  className={styles.textarea}
                  placeholder="Describe the defect, breakdown, or service requirement..."
                  value={formIssue}
                  onChange={(e) => setFormIssue(e.target.value)}
                  id="ticket-issue-desc"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Priority</label>
                  <select
                    className={styles.select}
                    value={formPriority}
                    onChange={(e) =>
                      setFormPriority(e.target.value as MaintenanceCard['priority'])
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Department</label>
                  <select
                    className={styles.select}
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Facilities">Facilities</option>
                    <option value="Field Ops">Field Ops</option>
                    <option value="Operations">Operations</option>
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
                  id="submit-ticket-btn"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Card Detail Modal */}
      {selectedCard && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setSelectedCard(null)}
        >
          <div
            className={styles.detailModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.cardTag}>{selectedCard.assetTag}</span>
                <h2 className={styles.modalTitle}>{selectedCard.assetName}</h2>
              </div>
              <button
                className={styles.closeModalBtn}
                onClick={() => setSelectedCard(null)}
              >
                ×
              </button>
            </div>
            <div className={styles.detailBody}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Issue:</span>
                <span className={styles.detailVal}>{selectedCard.issue}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Reported By:</span>
                <span className={styles.detailVal}>{selectedCard.reportedBy} ({selectedCard.department})</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Current Stage:</span>
                <span className={styles.detailVal}>{selectedCard.stage.replace('_', ' ').toUpperCase()}</span>
              </div>
              {selectedCard.assignedTechnician && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Technician:</span>
                  <span className={styles.detailVal}>{selectedCard.assignedTechnician}</span>
                </div>
              )}
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.submitBtn}
                onClick={() => setSelectedCard(null)}
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
