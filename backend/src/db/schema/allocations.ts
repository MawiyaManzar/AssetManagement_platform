import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { assets, assetConditionEnum } from "./assets.js";
import { departments } from "./departments.js";
import { users } from "./users.js";

// ── Allocation Status Enum ─────────────────────────────────
export const allocationStatusEnum = pgEnum("allocation_status", [
  "active",
  "returned",
  "transferred",
]);

// ── Transfer Request Status Enum ───────────────────────────
// Conflict Rule: When an asset is already allocated, a direct allocation is blocked.
// A transfer request is created (Requested → Approved → Re-allocated).
export const transferStatusEnum = pgEnum("transfer_status", [
  "pending",
  "approved",
  "rejected",
  "completed",
  "cancelled",
]);

// ── Asset Allocations Table ────────────────────────────────
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

// ── Asset Transfers Table ──────────────────────────────────
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

// ── Zod Schemas ───────────────────────────────────────────
export const insertAssetAllocationSchema = createInsertSchema(assetAllocations);
export const selectAssetAllocationSchema = createSelectSchema(assetAllocations);

export const insertAssetTransferSchema = createInsertSchema(assetTransfers, {
  reason: (schema) => schema.min(3, "Reason for transfer must be specified"),
});
export const selectAssetTransferSchema = createSelectSchema(assetTransfers);

export type AssetAllocation = z.infer<typeof selectAssetAllocationSchema>;
export type NewAssetAllocation = z.infer<typeof insertAssetAllocationSchema>;
export type AssetTransfer = z.infer<typeof selectAssetTransferSchema>;
export type NewAssetTransfer = z.infer<typeof insertAssetTransferSchema>;
export type AllocationStatus = (typeof allocationStatusEnum.enumValues)[number];
export type TransferStatus = (typeof transferStatusEnum.enumValues)[number];
