import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  numeric,
  timestamp,
  jsonb,
  pgEnum,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// ══════════════════════════════════════════════════════════
// 1. ENUMS
// ══════════════════════════════════════════════════════════

export const roleEnum = pgEnum("user_role", [
  "admin",
  "asset_manager",
  "department_head",
  "employee",
]);

export const userStatusEnum = pgEnum("user_status", ["active", "inactive"]);

export const departmentStatusEnum = pgEnum("department_status", [
  "active",
  "inactive",
]);

export const categoryStatusEnum = pgEnum("category_status", [
  "active",
  "inactive",
]);

export const assetStatusEnum = pgEnum("asset_status", [
  "available",
  "allocated",
  "reserved",
  "under_maintenance",
  "lost",
  "retired",
  "disposed",
]);

export const assetConditionEnum = pgEnum("asset_condition", [
  "new",
  "good",
  "fair",
  "poor",
  "damaged",
]);

export const allocationStatusEnum = pgEnum("allocation_status", [
  "active",
  "returned",
  "transferred",
]);

export const transferStatusEnum = pgEnum("transfer_status", [
  "pending",
  "approved",
  "rejected",
  "completed",
  "cancelled",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "upcoming",
  "ongoing",
  "completed",
  "cancelled",
]);

export const maintenancePriorityEnum = pgEnum("maintenance_priority", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const maintenanceStatusEnum = pgEnum("maintenance_status", [
  "pending",
  "approved",
  "rejected",
  "technician_assigned",
  "in_progress",
  "resolved",
  "cancelled",
]);

export const auditCycleStatusEnum = pgEnum("audit_cycle_status", [
  "draft",
  "in_progress",
  "review",
  "completed",
  "cancelled",
]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "pending",
  "verified",
  "missing",
  "damaged",
]);

export const discrepancyTypeEnum = pgEnum("discrepancy_type", [
  "missing_asset",
  "damaged_asset",
  "location_mismatch",
  "unauthorized_holder",
]);

export const discrepancyResolutionEnum = pgEnum(
  "discrepancy_resolution_status",
  [
    "unresolved",
    "investigating",
    "asset_found",
    "marked_lost",
    "repaired",
    "written_off",
  ]
);

export const notificationTypeEnum = pgEnum("notification_type", [
  "asset_assigned",
  "maintenance_approved",
  "maintenance_rejected",
  "booking_confirmed",
  "booking_cancelled",
  "booking_reminder",
  "transfer_approved",
  "transfer_requested",
  "overdue_return_alert",
  "audit_discrepancy_flagged",
  "general_system",
]);

// ══════════════════════════════════════════════════════════
// 2. MASTER & ORG SETUP TABLES
// ══════════════════════════════════════════════════════════

export interface CustomFieldDefinition {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "boolean" | "select";
  required?: boolean;
  options?: string[];
  defaultValue?: string | number | boolean;
}

export const departments = pgTable("departments", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  headId: uuid("head_id"),
  parentDepartmentId: uuid("parent_department_id").references(
    (): AnyPgColumn => departments.id,
    { onDelete: "set null" }
  ),
  status: departmentStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const assetCategories = pgTable("asset_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  customFieldsSchema: jsonb("custom_fields_schema")
    .$type<CustomFieldDefinition[]>()
    .notNull()
    .default([]),
  status: categoryStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: roleEnum("role").notNull().default("employee"),
  departmentId: uuid("department_id").references(() => departments.id, {
    onDelete: "set null",
  }),
  jobTitle: varchar("job_title", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  status: userStatusEnum("status").notNull().default("active"),
  photoUrl: text("photo_url"),
  emailVerified: boolean("email_verified").notNull().default(false),
  verificationToken: varchar("verification_token", { length: 255 }),
  resetToken: varchar("reset_token", { length: 255 }),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  refreshToken: varchar("refresh_token", { length: 512 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ══════════════════════════════════════════════════════════
// 3. ASSETS & INVENTORY TABLES
// ══════════════════════════════════════════════════════════

export interface AssetDocument {
  name: string;
  url: string;
  size?: number;
  uploadedAt?: string;
}

export const assets = pgTable("assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetTag: varchar("asset_tag", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => assetCategories.id, { onDelete: "restrict" }),
  serialNumber: varchar("serial_number", { length: 255 }),
  model: varchar("model", { length: 255 }),
  brand: varchar("brand", { length: 255 }),
  acquisitionDate: timestamp("acquisition_date"),
  acquisitionCost: numeric("acquisition_cost", { precision: 12, scale: 2 }),
  status: assetStatusEnum("status").notNull().default("available"),
  condition: assetConditionEnum("condition").notNull().default("good"),
  location: varchar("location", { length: 255 }).notNull(),
  departmentId: uuid("department_id").references(() => departments.id, {
    onDelete: "set null",
  }),
  currentHolderId: uuid("current_holder_id").references(() => users.id, {
    onDelete: "set null",
  }),
  isShared: boolean("is_shared").notNull().default(false),
  qrCode: text("qr_code"),
  imageUrl: text("image_url"),
  documents: jsonb("documents")
    .$type<AssetDocument[]>()
    .notNull()
    .default([]),
  customFields: jsonb("custom_fields")
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ══════════════════════════════════════════════════════════
// 4. ALLOCATIONS & TRANSFERS
// ══════════════════════════════════════════════════════════

export const assetAllocations = pgTable("asset_allocations", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id, { onDelete: "cascade" }),
  allocatedToUserId: uuid("allocated_to_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  allocatedToDepartmentId: uuid("allocated_to_department_id").references(
    () => departments.id,
    { onDelete: "set null" }
  ),
  allocatedByUserId: uuid("allocated_by_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  allocatedAt: timestamp("allocated_at").notNull().defaultNow(),
  expectedReturnDate: timestamp("expected_return_date"),
  actualReturnDate: timestamp("actual_return_date"),
  status: allocationStatusEnum("status").notNull().default("active"),
  notes: text("notes"),
  returnCondition: assetConditionEnum("return_condition"),
  returnNotes: text("return_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const assetTransfers = pgTable("asset_transfers", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id, { onDelete: "cascade" }),
  fromUserId: uuid("from_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  toUserId: uuid("to_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  fromDepartmentId: uuid("from_department_id").references(
    () => departments.id,
    { onDelete: "set null" }
  ),
  toDepartmentId: uuid("to_department_id").references(() => departments.id, {
    onDelete: "set null",
  }),
  requestedByUserId: uuid("requested_by_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  approvedByUserId: uuid("approved_by_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  status: transferStatusEnum("status").notNull().default("pending"),
  reason: text("reason").notNull(),
  approvalNotes: text("approval_notes"),
  requestedAt: timestamp("requested_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ══════════════════════════════════════════════════════════
// 5. RESOURCE BOOKINGS
// ══════════════════════════════════════════════════════════

export const resourceBookings = pgTable("resource_bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  departmentId: uuid("department_id").references(() => departments.id, {
    onDelete: "set null",
  }),
  title: varchar("title", { length: 255 }).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  purpose: text("purpose"),
  status: bookingStatusEnum("status").notNull().default("upcoming"),
  checkInTime: timestamp("check_in_time"),
  checkOutTime: timestamp("check_out_time"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ══════════════════════════════════════════════════════════
// 6. MAINTENANCE REQUESTS
// ══════════════════════════════════════════════════════════

export const maintenanceRequests = pgTable("maintenance_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id, { onDelete: "cascade" }),
  requestedByUserId: uuid("requested_by_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  approvedByUserId: uuid("approved_by_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  technicianId: uuid("technician_id").references(() => users.id, {
    onDelete: "set null",
  }),
  technicianName: varchar("technician_name", { length: 255 }),
  priority: maintenancePriorityEnum("priority").notNull().default("medium"),
  status: maintenanceStatusEnum("status").notNull().default("pending"),
  issueDescription: text("issue_description").notNull(),
  photoUrls: jsonb("photo_urls")
    .$type<string[]>()
    .notNull()
    .default([]),
  estimatedCost: numeric("estimated_cost", { precision: 12, scale: 2 }),
  actualCost: numeric("actual_cost", { precision: 12, scale: 2 }),
  repairNotes: text("repair_notes"),
  rejectionReason: text("rejection_reason"),
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ══════════════════════════════════════════════════════════
// 7. AUDITS & DISCREPANCIES
// ══════════════════════════════════════════════════════════

export const auditCycles = pgTable("audit_cycles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  scopeDepartmentId: uuid("scope_department_id").references(
    () => departments.id,
    { onDelete: "set null" }
  ),
  scopeLocation: varchar("scope_location", { length: 255 }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: auditCycleStatusEnum("status").notNull().default("draft"),
  createdByUserId: uuid("created_by_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  notes: text("notes"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const auditCycleAuditors = pgTable("audit_cycle_auditors", {
  id: uuid("id").primaryKey().defaultRandom(),
  auditCycleId: uuid("audit_cycle_id")
    .notNull()
    .references(() => auditCycles.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  assignedAt: timestamp("assigned_at").notNull().defaultNow(),
});

export const auditItems = pgTable("audit_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  auditCycleId: uuid("audit_cycle_id")
    .notNull()
    .references(() => auditCycles.id, { onDelete: "cascade" }),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id, { onDelete: "cascade" }),
  expectedLocation: varchar("expected_location", { length: 255 }),
  actualLocation: varchar("actual_location", { length: 255 }),
  expectedHolderId: uuid("expected_holder_id").references(() => users.id, {
    onDelete: "set null",
  }),
  actualHolderId: uuid("actual_holder_id").references(() => users.id, {
    onDelete: "set null",
  }),
  verificationStatus: verificationStatusEnum("verification_status")
    .notNull()
    .default("pending"),
  verifiedByUserId: uuid("verified_by_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  verifiedAt: timestamp("verified_at"),
  notes: text("notes"),
  condition: assetConditionEnum("condition"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const auditDiscrepancies = pgTable("audit_discrepancies", {
  id: uuid("id").primaryKey().defaultRandom(),
  auditCycleId: uuid("audit_cycle_id")
    .notNull()
    .references(() => auditCycles.id, { onDelete: "cascade" }),
  auditItemId: uuid("audit_item_id")
    .notNull()
    .references(() => auditItems.id, { onDelete: "cascade" }),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id, { onDelete: "cascade" }),
  discrepancyType: discrepancyTypeEnum("discrepancy_type").notNull(),
  description: text("description").notNull(),
  resolutionStatus: discrepancyResolutionEnum("resolution_status")
    .notNull()
    .default("unresolved"),
  resolutionNotes: text("resolution_notes"),
  resolvedByUserId: uuid("resolved_by_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ══════════════════════════════════════════════════════════
// 8. ACTIVITY LOGS & NOTIFICATIONS
// ══════════════════════════════════════════════════════════

export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 100 }).notNull(),
  entityId: varchar("entity_id", { length: 255 }),
  details: jsonb("details")
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),
  ipAddress: varchar("ip_address", { length: 100 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull().default("general_system"),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  link: varchar("link", { length: 500 }),
  isRead: boolean("is_read").notNull().default(false),
  readAt: timestamp("read_at"),
  metadata: jsonb("metadata")
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ══════════════════════════════════════════════════════════
// 9. RELATIONS
// ══════════════════════════════════════════════════════════

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

export const assetCategoriesRelations = relations(
  assetCategories,
  ({ many }) => ({
    assets: many(assets),
  })
);

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

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// ══════════════════════════════════════════════════════════
// 10. ZOD SCHEMAS & TS TYPES
// ══════════════════════════════════════════════════════════

export const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email("Invalid email format"),
  password: (schema) => schema.min(6, "Password must be at least 6 characters"),
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
});
export const selectUserSchema = createSelectSchema(users);
export const safeUserSchema = selectUserSchema.omit({
  password: true,
  refreshToken: true,
  verificationToken: true,
  resetToken: true,
  resetTokenExpiry: true,
});

export const insertDepartmentSchema = createInsertSchema(departments);
export const selectDepartmentSchema = createSelectSchema(departments);

export const insertAssetCategorySchema = createInsertSchema(assetCategories);
export const selectAssetCategorySchema = createSelectSchema(assetCategories);

export const insertAssetSchema = createInsertSchema(assets);
export const selectAssetSchema = createSelectSchema(assets);

export const insertAssetAllocationSchema = createInsertSchema(assetAllocations);
export const selectAssetAllocationSchema = createSelectSchema(assetAllocations);

export const insertAssetTransferSchema = createInsertSchema(assetTransfers);
export const selectAssetTransferSchema = createSelectSchema(assetTransfers);

export const insertResourceBookingSchema = createInsertSchema(resourceBookings);
export const selectResourceBookingSchema = createSelectSchema(resourceBookings);

export const insertMaintenanceRequestSchema =
  createInsertSchema(maintenanceRequests);
export const selectMaintenanceRequestSchema =
  createSelectSchema(maintenanceRequests);

export const insertAuditCycleSchema = createInsertSchema(auditCycles);
export const selectAuditCycleSchema = createSelectSchema(auditCycles);

export const insertAuditItemSchema = createInsertSchema(auditItems);
export const selectAuditItemSchema = createSelectSchema(auditItems);

export const insertAuditDiscrepancySchema =
  createInsertSchema(auditDiscrepancies);
export const selectAuditDiscrepancySchema =
  createSelectSchema(auditDiscrepancies);

export const insertActivityLogSchema = createInsertSchema(activityLogs);
export const selectActivityLogSchema = createSelectSchema(activityLogs);

export const insertNotificationSchema = createInsertSchema(notifications);
export const selectNotificationSchema = createSelectSchema(notifications);

export type User = z.infer<typeof selectUserSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;
export type SafeUser = z.infer<typeof safeUserSchema>;
export type UserRole = (typeof roleEnum.enumValues)[number];
export type UserStatus = (typeof userStatusEnum.enumValues)[number];

export type Department = z.infer<typeof selectDepartmentSchema>;
export type NewDepartment = z.infer<typeof insertDepartmentSchema>;
export type DepartmentStatus = (typeof departmentStatusEnum.enumValues)[number];

export type AssetCategory = z.infer<typeof selectAssetCategorySchema>;
export type NewAssetCategory = z.infer<typeof insertAssetCategorySchema>;
export type CategoryStatus = (typeof categoryStatusEnum.enumValues)[number];

export type Asset = z.infer<typeof selectAssetSchema>;
export type NewAsset = z.infer<typeof insertAssetSchema>;
export type AssetStatus = (typeof assetStatusEnum.enumValues)[number];
export type AssetCondition = (typeof assetConditionEnum.enumValues)[number];

export type AssetAllocation = z.infer<typeof selectAssetAllocationSchema>;
export type NewAssetAllocation = z.infer<typeof insertAssetAllocationSchema>;
export type AllocationStatus = (typeof allocationStatusEnum.enumValues)[number];

export type AssetTransfer = z.infer<typeof selectAssetTransferSchema>;
export type NewAssetTransfer = z.infer<typeof insertAssetTransferSchema>;
export type TransferStatus = (typeof transferStatusEnum.enumValues)[number];

export type ResourceBooking = z.infer<typeof selectResourceBookingSchema>;
export type NewResourceBooking = z.infer<typeof insertResourceBookingSchema>;
export type BookingStatus = (typeof bookingStatusEnum.enumValues)[number];

export type MaintenanceRequest = z.infer<typeof selectMaintenanceRequestSchema>;
export type NewMaintenanceRequest = z.infer<
  typeof insertMaintenanceRequestSchema
>;
export type MaintenancePriority =
  (typeof maintenancePriorityEnum.enumValues)[number];
export type MaintenanceStatus =
  (typeof maintenanceStatusEnum.enumValues)[number];

export type AuditCycle = z.infer<typeof selectAuditCycleSchema>;
export type NewAuditCycle = z.infer<typeof insertAuditCycleSchema>;
export type AuditItem = z.infer<typeof selectAuditItemSchema>;
export type NewAuditItem = z.infer<typeof insertAuditItemSchema>;
export type AuditDiscrepancy = z.infer<typeof selectAuditDiscrepancySchema>;
export type NewAuditDiscrepancy = z.infer<typeof insertAuditDiscrepancySchema>;
export type AuditCycleStatus = (typeof auditCycleStatusEnum.enumValues)[number];
export type VerificationStatus =
  (typeof verificationStatusEnum.enumValues)[number];
export type DiscrepancyType = (typeof discrepancyTypeEnum.enumValues)[number];
export type DiscrepancyResolutionStatus =
  (typeof discrepancyResolutionEnum.enumValues)[number];

export type ActivityLog = z.infer<typeof selectActivityLogSchema>;
export type NewActivityLog = z.infer<typeof insertActivityLogSchema>;

export type Notification = z.infer<typeof selectNotificationSchema>;
export type NewNotification = z.infer<typeof insertNotificationSchema>;
export type NotificationType = (typeof notificationTypeEnum.enumValues)[number];
