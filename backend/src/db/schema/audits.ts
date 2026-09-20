import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { assets, assetConditionEnum } from "./assets.js";
import { departments } from "./departments.js";
import { users } from "./users.js";

// ── Audit Cycle Status Enum ────────────────────────────────
export const auditCycleStatusEnum = pgEnum("audit_cycle_status", [
  "draft",
  "in_progress",
  "review",
  "completed",
  "cancelled",
]);

// ── Item Verification Status Enum ──────────────────────────
export const verificationStatusEnum = pgEnum("verification_status", [
  "pending",
  "verified",
  "missing",
  "damaged",
]);

// ── Discrepancy Type Enum ──────────────────────────────────
export const discrepancyTypeEnum = pgEnum("discrepancy_type", [
  "missing_asset",
  "damaged_asset",
  "location_mismatch",
  "unauthorized_holder",
]);

// ── Discrepancy Resolution Status Enum ─────────────────────
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

// ── Audit Cycles Table ─────────────────────────────────────
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

// ── Audit Cycle Auditors (Junction Table) ──────────────────
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

// ── Audit Items Table (Physical verification per asset) ────
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

// ── Audit Discrepancies Table (Auto-generated report records) ─
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

// ── Zod Schemas ───────────────────────────────────────────
export const insertAuditCycleSchema = createInsertSchema(auditCycles, {
  name: (schema) => schema.min(3, "Audit cycle name is required"),
});
export const selectAuditCycleSchema = createSelectSchema(auditCycles);

export const insertAuditItemSchema = createInsertSchema(auditItems);
export const selectAuditItemSchema = createSelectSchema(auditItems);

export const insertAuditDiscrepancySchema = createInsertSchema(
  auditDiscrepancies
);
export const selectAuditDiscrepancySchema = createSelectSchema(
  auditDiscrepancies
);

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
