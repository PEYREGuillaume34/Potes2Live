import { relations, sql } from "drizzle-orm";
import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  boolean, 
  integer, 
  index, 
  date, 
  uniqueIndex,
  doublePrecision,
  varchar
} from 'drizzle-orm/pg-core';

// ========================================
// TABLE UTILISATEUR (Better-Auth compatible)
// ========================================
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  avatar_url: text("avatar_url"),
  bio: text("bio"), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// ========================================
// TABLES D'AUTHENTIFICATION (Better-Auth)
// ========================================
export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

// ========================================
// TABLES MÉTIER - CONCERTS
// ========================================
export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  genre: varchar("genre", { length: 100 }), // Rock, Hip-Hop, etc.
  imageUrl: text("image_url"),
  spotifyUrl: text("spotify_url"),
  instagramUrl: text("instagram_url"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  city: varchar("city", { length: 100 }).notNull(),
  postalCode: varchar("postal_code", { length: 10 }),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  capacity: integer("capacity"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("venues_city_idx").on(table.city)
]);

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull().unique(), // pour URL propre
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  
  artistId: integer("artist_id")
    .references(() => artists.id, { onDelete: "cascade" })
    .notNull(),
  
  venueId: integer("venue_id")
    .references(() => venues.id, { onDelete: "cascade" })
    .notNull(),
  
  eventDate: timestamp("event_date").notNull(),
  eventTime: varchar("event_time", { length: 5 }), // "20:00"
  
  price: doublePrecision("price"),
  ticketUrl: text("ticket_url"), // lien billeterie externe
  
  status: varchar("status", { length: 20 }).default("upcoming").notNull(), // upcoming, completed, cancelled
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("events_date_idx").on(table.eventDate),
  index("events_artist_idx").on(table.artistId),
  index("events_venue_idx").on(table.venueId),
]);

// ========================================
// TABLES GROUPES
// ========================================
export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  
  eventId: integer("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  
  ownerId: text("owner_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  
  maxMembers: integer("max_members").default(10).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("groups_event_idx").on(table.eventId),
  index("groups_owner_idx").on(table.ownerId),
  uniqueIndex("one_active_group_per_user_per_event").on(table.eventId, table.ownerId, table.isActive)
    .where(sql`${table.isActive} = true`),
]);

export const groupMembers = pgTable(
  "group_members",
  {
    id: serial("id").primaryKey(),
    
    groupId: integer("group_id")
      .references(() => groups.id, { onDelete: "cascade" })
      .notNull(),
    
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    
    role: varchar("role", { length: 20 }).default("member").notNull(), // owner | member
    status: varchar("status", { length: 20 }).default("active").notNull(), // active | left
    
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueMember: uniqueIndex("group_user_unique").on(table.groupId, table.userId),
    groupIdx: index("group_members_group_idx").on(table.groupId),
    userIdx: index("group_members_user_idx").on(table.userId),
  })
);

export const groupMessages = pgTable("group_messages", {
  id: serial("id").primaryKey(),
  
  groupId: integer("group_id")
    .references(() => groups.id, { onDelete: "cascade" })
    .notNull(),
  
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  
  content: text("content").notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("messages_group_idx").on(table.groupId),
  index("messages_created_idx").on(table.createdAt),
]);



// ========================================
// RELATIONS DRIZZLE
// ========================================
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  groups: many(groups),
  groupMemberships: many(groupMembers),
  messages: many(groupMessages),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const artistRelations = relations(artists, ({ many }) => ({
  events: many(events),
}));

export const venueRelations = relations(venues, ({ many }) => ({
  events: many(events),
}));

export const eventRelations = relations(events, ({ one, many }) => ({
  artist: one(artists, {
    fields: [events.artistId],
    references: [artists.id],
  }),
  venue: one(venues, {
    fields: [events.venueId],
    references: [venues.id],
  }),
  groups: many(groups),
}));

export const groupRelations = relations(groups, ({ one, many }) => ({
  event: one(events, {
    fields: [groups.eventId],
    references: [events.id],
  }),
  owner: one(user, {
    fields: [groups.ownerId],
    references: [user.id],
  }),
  members: many(groupMembers),
  messages: many(groupMessages),
}));

export const groupMemberRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(user, {
    fields: [groupMembers.userId],
    references: [user.id],
  }),
}));

export const groupMessageRelations = relations(groupMessages, ({ one }) => ({
  group: one(groups, {
    fields: [groupMessages.groupId],
    references: [groups.id],
  }),
  user: one(user, {
    fields: [groupMessages.userId],
    references: [user.id],
  }),
}));






