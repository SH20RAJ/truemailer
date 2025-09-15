import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: text("id").primaryKey(), // StackAuth user ID
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  profileImageUrl: text("profile_image_url"),
  primaryEmail: text("primary_email"),
  primaryEmailVerified: int("primary_email_verified", { mode: "boolean" }).default(false),
  clientMetadata: text("client_metadata", { mode: "json" }),
  serverMetadata: text("server_metadata", { mode: "json" }),
  createdAt: int("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).notNull(),
});

// Table for storing user sessions if needed
export const sessionsTable = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  expiresAt: int("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: int("created_at", { mode: "timestamp" }).notNull(),
});

// Simple todos table with just id and content
export const todosTable = sqliteTable("todos", {
  id: int("id").primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
});

// API Keys table
export const apiKeysTable = sqliteTable("api_keys", {
  id: text("id").primaryKey(), // API key ID
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  keyHash: text("key_hash").notNull(), // Hashed API key for security
  name: text("name").notNull(), // User-defined name for the key
  isActive: int("is_active", { mode: "boolean" }).default(true),
  monthlyQuota: int("monthly_quota").default(5000), // Default 5000 requests per month
  currentUsage: int("current_usage").default(0), // Current month usage
  lastUsageReset: int("last_usage_reset", { mode: "timestamp" }).notNull(), // When usage was last reset
  createdAt: int("created_at", { mode: "timestamp" }).notNull(),
  lastUsedAt: int("last_used_at", { mode: "timestamp" }),
});

// API Usage Analytics table
export const apiUsageTable = sqliteTable("api_usage", {
  id: int("id").primaryKey({ autoIncrement: true }),
  apiKeyId: text("api_key_id").notNull().references(() => apiKeysTable.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull(), // e.g., '/api/v2/validate'
  method: text("method").notNull(), // GET, POST, etc.
  statusCode: int("status_code").notNull(), // HTTP status code
  responseTime: int("response_time"), // Response time in milliseconds
  ipAddress: text("ip_address"), // Client IP address
  userAgent: text("user_agent"), // Client user agent
  requestSize: int("request_size"), // Request size in bytes
  responseSize: int("response_size"), // Response size in bytes
  timestamp: int("timestamp", { mode: "timestamp" }).notNull(),
});

// Export types for TypeScript
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type Session = typeof sessionsTable.$inferSelect;
export type NewSession = typeof sessionsTable.$inferInsert;
export type Todo = typeof todosTable.$inferSelect;
export type NewTodo = typeof todosTable.$inferInsert;
export type ApiKey = typeof apiKeysTable.$inferSelect;
export type NewApiKey = typeof apiKeysTable.$inferInsert;
export type ApiUsage = typeof apiUsageTable.$inferSelect;
export type NewApiUsage = typeof apiUsageTable.$inferInsert;