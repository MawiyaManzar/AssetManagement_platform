/**
 * AssetFlow Central Schema Barrel File
 * Exports all Drizzle ORM tables, enums, relations, and auto-generated Zod schemas.
 */

// ── Master / Organization Setup ──
export * from "./departments.js";
export * from "./categories.js";
export * from "./users.js";

// ── Core Asset Management ──
export * from "./assets.js";
export * from "./allocations.js";
export * from "./bookings.js";
export * from "./maintenance.js";

// ── Audits & Operations ──
export * from "./audits.js";
export * from "./activity-logs.js";
export * from "./notifications.js";

// ── Relational Mappings ──
export * from "./relations.js";
