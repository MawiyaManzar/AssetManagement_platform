import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  jsonb,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users.js";

// ── Notification Type Enum ─────────────────────────────────
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

// ── Notifications Table ────────────────────────────────────
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

// ── Zod Schemas ───────────────────────────────────────────
export const insertNotificationSchema = createInsertSchema(notifications);
export const selectNotificationSchema = createSelectSchema(notifications);

export type Notification = z.infer<typeof selectNotificationSchema>;
export type NewNotification = z.infer<typeof insertNotificationSchema>;
export type NotificationType = (typeof notificationTypeEnum.enumValues)[number];
