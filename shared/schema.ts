import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  json,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const grids = pgTable("grids", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  gridData: json("grid_data").notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGridSchema = createInsertSchema(grids).pick({
  name: true,
  gridData: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGrid = z.infer<typeof insertGridSchema>;
export type Grid = typeof grids.$inferSelect;
