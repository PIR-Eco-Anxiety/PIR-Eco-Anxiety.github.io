import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const roleTable = sqliteTable("role_table", {
  id: int().primaryKey(),
  name: text().unique().notNull(),
  description: text()
});

export const locationTable = sqliteTable("location_table", {
  id: int().primaryKey(),
  name: text().unique().notNull(),
  description: text()
});

export const actionTable = sqliteTable("action_table", {
  id: int().primaryKey(),
  name: text().unique().notNull(),
  points: int().notNull(),
  description: text(),
});

export const eventTable = sqliteTable("event_table", {
  id: int().primaryKey(),
  name: text().unique().notNull(),
  description: text(),
});

export const conditionTable = sqliteTable("condition_table", {
  id: int().primaryKey({autoIncrement: true}),  // We auto-increment since it's not defined in JSON rep
  description: text(),
  type: text({enum: ["roleLocation", "event"]}).notNull(),
  actionId: int().references(() => actionTable.id),
  roleId: int().references(() => roleTable.id),
  locationId: int().references(() => locationTable.id),
  eventId: int().references(() => eventTable.id),
  eventOccured: int()
});

export const playerTable = sqliteTable("player_table", {
  id: int().primaryKey({autoIncrement: true}),
  name: text().unique().notNull(),
  roleId: int().references(() => roleTable.id),
  locationId: int().references(() => locationTable.id),
});

export const actionCompletionTable = sqliteTable("action_completion_table", {
  id: int().primaryKey({autoIncrement: true}),
  actionId: int().references(() => actionTable.id),
  playerId: int().references(() => playerTable.id),
});

export const eventOccurenceTable = sqliteTable("event_occurence_table", {
  id: int().primaryKey({autoIncrement: true}),
  eventId: int().references(() => eventTable.id),
});

