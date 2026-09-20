import { relations } from "drizzle-orm";
import { users } from "./users.js";
import { departments } from "./departments.js";
import { assetCategories } from "./categories.js";
import { assets } from "./assets.js";
import { assetAllocations, assetTransfers } from "./allocations.js";
import { resourceBookings } from "./bookings.js";
import { maintenanceRequests } from "./maintenance.js";
import {
  auditCycles,
  auditCycleAuditors,
  auditItems,
  auditDiscrepancies,
} from "./audits.js";
import { activityLogs } from "./activity-logs.js";
import { notifications } from "./notifications.js";

// ── User Relations ─────────────────────────────────────────
export const usersRelations = relations(users, ({ one, many }) => ({
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),
  heldAssets: many(assets, { relationName: "currentHolder" }),
  allocations: many(assetAllocations, { relationName: "allocatedToUser" }),
  sentTransfers: many(assetTransfers, { relationName: "fromUser" }),
  receivedTransfers: many(assetTransfers, { relationName: "toUser" }),
  requestedTransfers: many(assetTransfers, { relationName: "requestedByUser" }),
  bookings: many(resourceBookings),
  maintenanceRequests: many(maintenanceRequests, {
    relationName: "requestedByUser",
  }),
  auditorAssignments: many(auditCycleAuditors),
  activityLogs: many(activityLogs),
  notifications: many(notifications),
}));

// ── Department Relations ───────────────────────────────────
export const departmentsRelations = relations(departments, ({ one, many }) => ({
  head: one(users, {
    fields: [departments.headId],
    references: [users.id],
  }),
  parentDepartment: one(departments, {
    fields: [departments.parentDepartmentId],
    references: [departments.id],
    relationName: "departmentHierarchy",
  }),
  subDepartments: many(departments, {
    relationName: "departmentHierarchy",
  }),
  employees: many(users),
  assets: many(assets),
  allocations: many(assetAllocations),
}));

// ── Asset Category Relations ───────────────────────────────
export const assetCategoriesRelations = relations(
  assetCategories,
  ({ many }) => ({
    assets: many(assets),
  })
);

// ── Asset Relations ────────────────────────────────────────
export const assetsRelations = relations(assets, ({ one, many }) => ({
  category: one(assetCategories, {
    fields: [assets.categoryId],
    references: [assetCategories.id],
  }),
  department: one(departments, {
    fields: [assets.departmentId],
    references: [departments.id],
  }),
  currentHolder: one(users, {
    fields: [assets.currentHolderId],
    references: [users.id],
    relationName: "currentHolder",
  }),
  allocations: many(assetAllocations),
  transfers: many(assetTransfers),
  bookings: many(resourceBookings),
  maintenanceRequests: many(maintenanceRequests),
  auditItems: many(auditItems),
  auditDiscrepancies: many(auditDiscrepancies),
}));

// ── Asset Allocation Relations ─────────────────────────────
export const assetAllocationsRelations = relations(
  assetAllocations,
  ({ one }) => ({
    asset: one(assets, {
      fields: [assetAllocations.assetId],
      references: [assets.id],
    }),
    allocatedToUser: one(users, {
      fields: [assetAllocations.allocatedToUserId],
      references: [users.id],
      relationName: "allocatedToUser",
    }),
    allocatedToDepartment: one(departments, {
      fields: [assetAllocations.allocatedToDepartmentId],
      references: [departments.id],
    }),
    allocatedByUser: one(users, {
      fields: [assetAllocations.allocatedByUserId],
      references: [users.id],
      relationName: "allocatedByUser",
    }),
  })
);

// ── Asset Transfer Relations ───────────────────────────────
export const assetTransfersRelations = relations(assetTransfers, ({ one }) => ({
  asset: one(assets, {
    fields: [assetTransfers.assetId],
    references: [assets.id],
  }),
  fromUser: one(users, {
    fields: [assetTransfers.fromUserId],
    references: [users.id],
    relationName: "fromUser",
  }),
  toUser: one(users, {
    fields: [assetTransfers.toUserId],
    references: [users.id],
    relationName: "toUser",
  }),
  fromDepartment: one(departments, {
    fields: [assetTransfers.fromDepartmentId],
    references: [departments.id],
    relationName: "fromDepartment",
  }),
  toDepartment: one(departments, {
    fields: [assetTransfers.toDepartmentId],
    references: [departments.id],
    relationName: "toDepartment",
  }),
  requestedByUser: one(users, {
    fields: [assetTransfers.requestedByUserId],
    references: [users.id],
    relationName: "requestedByUser",
  }),
  approvedByUser: one(users, {
    fields: [assetTransfers.approvedByUserId],
    references: [users.id],
    relationName: "approvedByUser",
  }),
}));

// ── Resource Booking Relations ─────────────────────────────
export const resourceBookingsRelations = relations(
  resourceBookings,
  ({ one }) => ({
    asset: one(assets, {
      fields: [resourceBookings.assetId],
      references: [assets.id],
    }),
    user: one(users, {
      fields: [resourceBookings.userId],
      references: [users.id],
    }),
    department: one(departments, {
      fields: [resourceBookings.departmentId],
      references: [departments.id],
    }),
  })
);

// ── Maintenance Request Relations ──────────────────────────
export const maintenanceRequestsRelations = relations(
  maintenanceRequests,
  ({ one }) => ({
    asset: one(assets, {
      fields: [maintenanceRequests.assetId],
      references: [assets.id],
    }),
    requestedByUser: one(users, {
      fields: [maintenanceRequests.requestedByUserId],
      references: [users.id],
      relationName: "requestedByUser",
    }),
    approvedByUser: one(users, {
      fields: [maintenanceRequests.approvedByUserId],
      references: [users.id],
      relationName: "approvedByUser",
    }),
    technician: one(users, {
      fields: [maintenanceRequests.technicianId],
      references: [users.id],
      relationName: "technician",
    }),
  })
);

// ── Audit Relations ────────────────────────────────────────
export const auditCyclesRelations = relations(auditCycles, ({ one, many }) => ({
  scopeDepartment: one(departments, {
    fields: [auditCycles.scopeDepartmentId],
    references: [departments.id],
  }),
  createdByUser: one(users, {
    fields: [auditCycles.createdByUserId],
    references: [users.id],
  }),
  auditors: many(auditCycleAuditors),
  items: many(auditItems),
  discrepancies: many(auditDiscrepancies),
}));

export const auditCycleAuditorsRelations = relations(
  auditCycleAuditors,
  ({ one }) => ({
    auditCycle: one(auditCycles, {
      fields: [auditCycleAuditors.auditCycleId],
      references: [auditCycles.id],
    }),
    auditor: one(users, {
      fields: [auditCycleAuditors.userId],
      references: [users.id],
    }),
  })
);

export const auditItemsRelations = relations(auditItems, ({ one, many }) => ({
  auditCycle: one(auditCycles, {
    fields: [auditItems.auditCycleId],
    references: [auditCycles.id],
  }),
  asset: one(assets, {
    fields: [auditItems.assetId],
    references: [assets.id],
  }),
  expectedHolder: one(users, {
    fields: [auditItems.expectedHolderId],
    references: [users.id],
    relationName: "expectedHolder",
  }),
  actualHolder: one(users, {
    fields: [auditItems.actualHolderId],
    references: [users.id],
    relationName: "actualHolder",
  }),
  verifiedByUser: one(users, {
    fields: [auditItems.verifiedByUserId],
    references: [users.id],
    relationName: "verifiedByUser",
  }),
  discrepancies: many(auditDiscrepancies),
}));

export const auditDiscrepanciesRelations = relations(
  auditDiscrepancies,
  ({ one }) => ({
    auditCycle: one(auditCycles, {
      fields: [auditDiscrepancies.auditCycleId],
      references: [auditCycles.id],
    }),
    auditItem: one(auditItems, {
      fields: [auditDiscrepancies.auditItemId],
      references: [auditItems.id],
    }),
    asset: one(assets, {
      fields: [auditDiscrepancies.assetId],
      references: [assets.id],
    }),
    resolvedByUser: one(users, {
      fields: [auditDiscrepancies.resolvedByUserId],
      references: [users.id],
    }),
  })
);

// ── Activity Log Relations ─────────────────────────────────
export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

// ── Notification Relations ─────────────────────────────────
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
