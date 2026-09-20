import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { assets } from "./assets.js";
import { users } from "./users.js";

// ── Maintenance Priority Enum ──────────────────────────────
export const maintenancePriorityEnum = pgEnum("maintenance_priority", [
  "low",
  "medium",
  "high",
  "critical",
]);

// ── Maintenance Status Enum ────────────────────────────────
// Workflow: Pending → Approved / Rejected (by Asset Manager) → Technician Assigned → In Progress → Resolved
// On approval: Asset status auto-updates to Under Maintenance
// On resolution: Asset status auto-updates back to Available
export const maintenanceStatusEnum = pgEnum("maintenance_status", [
  "pending",
  "approved",
  "rejected",
  "technician_assigned",
  "in_progress",
  "resolved",
  "cancelled",
]);

// ── Maintenance Requests Table ─────────────────────────────
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

// ── Zod Schemas ───────────────────────────────────────────
export const insertMaintenanceRequestSchema = createInsertSchema(
  maintenanceRequests,
  {
    issueDescription: (schema) =>
      schema.min(5, "Issue description must be at least 5 characters"),
  }
);

export const selectMaintenanceRequestSchema =
  createSelectSchema(maintenanceRequests);

export type MaintenanceRequest = z.infer<typeof selectMaintenanceRequestSchema>;
export type NewMaintenanceRequest = z.infer<
  typeof insertMaintenanceRequestSchema
>;
export type MaintenancePriority =
  (typeof maintenancePriorityEnum.enumValues)[number];
export type MaintenanceStatus =
  (typeof maintenanceStatusEnum.enumValues)[number];
