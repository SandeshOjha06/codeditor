import { id } from "date-fns/locale"
import { pgTable, text, uuid, timestamp, varchar } from "drizzle-orm/pg-core"

export const account = pgTable("account",{
  id: uuid("id").defaultRandom().primaryKey(),
  userId : uuid("userId").notNull().references(() => users.id),
  type : varchar("type", {length : 50}).notNull(),
  provider: text("provider"),
  providerAccountId: text("providerAccountId"),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: timestamp("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
})

export const users = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  emailVerified: timestamp("emailVerified"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})


export const role = pgTable("roles",{
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
})

export const userRole = pgTable("user_roles",{
  userId : uuid("userId").notNull().references(() => users.id),
  roleId : uuid("roleId").notNull().references(() => role.id),
})