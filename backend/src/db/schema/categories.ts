import {
  pgTable,
  uuid,
  varchar,
  text,
  jsonb,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// ── Category Status Enum ───────────────────────────────────
export const categoryStatusEnum = pgEnum("category_status", [
  "active",
  "inactive",
]);

export interface CustomFieldDefinition {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "boolean" | "select";
  required?: boolean;
  options?: string[]; // for select type
  defaultValue?: string | number | boolean;
}

// ── Asset Categories Table ─────────────────────────────────
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

// ── Zod Schemas ───────────────────────────────────────────
export const customFieldDefinitionSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(["text", "number", "date", "boolean", "select"]),
  required: z.boolean().optional().default(false),
  options: z.array(z.string()).optional(),
  defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
});

export const insertAssetCategorySchema = createInsertSchema(assetCategories, {
  name: (schema) => schema.min(2, "Category name must be at least 2 characters"),
  code: (schema) => schema.min(2, "Category code must be at least 2 characters").toUpperCase(),
});

export const selectAssetCategorySchema = createSelectSchema(assetCategories);

export type AssetCategory = z.infer<typeof selectAssetCategorySchema>;
export type NewAssetCategory = z.infer<typeof insertAssetCategorySchema>;
