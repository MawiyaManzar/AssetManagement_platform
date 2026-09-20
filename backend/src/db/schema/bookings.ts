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
import { assets } from "./assets.js";
import { departments } from "./departments.js";
import { users } from "./users.js";

// ── Booking Status Enum ────────────────────────────────────
// Resource Booking States:
// - upcoming: Future slot booked
// - ongoing: Active slot during time range
// - completed: Resource usage concluded
// - cancelled: Cancelled by user/manager
export const bookingStatusEnum = pgEnum("booking_status", [
  "upcoming",
  "ongoing",
  "completed",
  "cancelled",
]);

// ── Resource Bookings Table ────────────────────────────────
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

// ── Zod Schemas ───────────────────────────────────────────
export const insertResourceBookingSchema = createInsertSchema(resourceBookings, {
  title: (schema) => schema.min(2, "Title must be at least 2 characters"),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
}).refine((data) => data.endTime > data.startTime, {
  message: "End time must be after start time",
  path: ["endTime"],
});

export const selectResourceBookingSchema = createSelectSchema(resourceBookings);

export type ResourceBooking = z.infer<typeof selectResourceBookingSchema>;
export type NewResourceBooking = z.infer<typeof insertResourceBookingSchema>;
export type BookingStatus = (typeof bookingStatusEnum.enumValues)[number];
