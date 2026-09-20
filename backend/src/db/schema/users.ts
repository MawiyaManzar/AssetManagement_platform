import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  pgEnum,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { departments } from "./departments.js";

// ── Role Enum ──────────────────────────────────────────────
// System Roles specified by the AssetFlow problem statement:
// - admin: Org setup, role promotions, audit management, org-wide analytics
// - asset_manager: Registers/allocates assets, approves transfers, maintenance, and audit discrepancies
// - department_head: Oversees department assets, approves department transfers, books resources
// - employee: Default signup role, views personal assets, books shared resources, raises requests
export const roleEnum = pgEnum("user_role", [
  "admin",
  "asset_manager",
  "department_head",
  "employee",
]);

// ── User Status Enum ───────────────────────────────────────
export const userStatusEnum = pgEnum("user_status", [
  "active",
  "inactive",
]);

// ── Users Table ────────────────────────────────────────────
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

// ── Auto-generated Zod Schemas ─────────────────────────────
export const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email("Invalid email format"),
  password: (schema) => schema.min(6, "Password must be at least 6 characters"),
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
});

export const selectUserSchema = createSelectSchema(users);

// ── Safe user (omits sensitive fields) ─────────────────────
export const safeUserSchema = selectUserSchema.omit({
  password: true,
  refreshToken: true,
  verificationToken: true,
  resetToken: true,
  resetTokenExpiry: true,
});

export type User = z.infer<typeof selectUserSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;
export type SafeUser = z.infer<typeof safeUserSchema>;
export type UserRole = (typeof roleEnum.enumValues)[number];
export type UserStatus = (typeof userStatusEnum.enumValues)[number];
