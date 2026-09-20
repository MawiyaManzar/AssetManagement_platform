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
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { assetCategories } from "./categories.js";
import { departments } from "./departments.js";
import { users } from "./users.js";

// ── Asset Lifecycle Status Enum ────────────────────────────
// AssetFlow lifecycle states:
// - available: In storage / unassigned, ready for allocation or booking
// - allocated: Assigned to employee or department
// - reserved: Held for upcoming allocation or booking
// - under_maintenance: In repair workflow
// - lost: Marked missing/lost during audit or incident
// - retired: Decommissioned / end of useful life
// - disposed: Permanently discarded/sold
export const assetStatusEnum = pgEnum("asset_status", [
  "available",
  "allocated",
  "reserved",
  "under_maintenance",
  "lost",
  "retired",
  "disposed",
]);

// ── Asset Condition Enum ───────────────────────────────────
export const assetConditionEnum = pgEnum("asset_condition", [
  "new",
  "good",
  "fair",
  "poor",
  "damaged",
]);

export interface AssetDocument {
  name: string;
  url: string;
  size?: number;
  uploadedAt?: string;
}

// ── Assets Table ───────────────────────────────────────────
export const assets = pgTable("assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetTag: varchar("asset_tag", { length: 100 }).notNull().unique(), // e.g., AF-0001
  name: varchar("name", { length: 255 }).notNull(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => assetCategories.id, { onDelete: "restrict" }),
  serialNumber: varchar("serial_number", { length: 255 }),
  model: varchar("model", { length: 255 }),
  brand: varchar("brand", { length: 255 }),
  acquisitionDate: timestamp("acquisition_date"),
  acquisitionCost: numeric("acquisition_cost", { precision: 12, scale: 2 }), // For reporting only
  status: assetStatusEnum("status").notNull().default("available"),
  condition: assetConditionEnum("condition").notNull().default("good"),
  location: varchar("location", { length: 255 }).notNull(),
  departmentId: uuid("department_id").references(() => departments.id, {
    onDelete: "set null",
  }),
  currentHolderId: uuid("current_holder_id").references(() => users.id, {
    onDelete: "set null",
  }),
  isShared: boolean("is_shared").notNull().default(false), // shared/bookable resource flag
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

// ── Zod Schemas ───────────────────────────────────────────
export const insertAssetSchema = createInsertSchema(assets, {
  name: (schema) => schema.min(2, "Asset name must be at least 2 characters"),
  location: (schema) => schema.min(2, "Location is required"),
  assetTag: (schema) => schema.min(1, "Asset Tag is required"),
});

export const selectAssetSchema = createSelectSchema(assets);

export type Asset = z.infer<typeof selectAssetSchema>;
export type NewAsset = z.infer<typeof insertAssetSchema>;
export type AssetStatus = (typeof assetStatusEnum.enumValues)[number];
export type AssetCondition = (typeof assetConditionEnum.enumValues)[number];
