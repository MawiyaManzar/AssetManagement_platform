import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// ── Department Status Enum ─────────────────────────────────
export const departmentStatusEnum = pgEnum("department_status", [
  "active",
  "inactive",
]);

// ── Departments Table ──────────────────────────────────────
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

// ── Zod Schemas ───────────────────────────────────────────
export const insertDepartmentSchema = createInsertSchema(departments, {
  name: (schema) => schema.min(2, "Department name must be at least 2 characters"),
  code: (schema) => schema.min(2, "Department code must be at least 2 characters").toUpperCase(),
});

export const selectDepartmentSchema = createSelectSchema(departments);

export type Department = z.infer<typeof selectDepartmentSchema>;
export type NewDepartment = z.infer<typeof insertDepartmentSchema>;
