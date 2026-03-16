import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const taqyeemUsers = pgTable("taqyeem_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("user"),
  reviewCount: integer("review_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const taqyeemBusinesses = pgTable("taqyeem_businesses", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  nameAr: varchar("name_ar", { length: 255 }),
  sector: varchar("sector", { length: 100 }),
  city: varchar("city", { length: 100 }),
  address: text("address"),
  lat: numeric("lat", { precision: 10, scale: 7 }),
  lng: numeric("lng", { precision: 10, scale: 7 }),
  geofenceRadius: integer("geofence_radius").notNull().default(200),
  phone: varchar("phone", { length: 50 }),
  website: varchar("website", { length: 500 }),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  tier: varchar("tier", { length: 50 }).notNull().default("free"),
  ownerId: uuid("owner_id").references(() => taqyeemUsers.id),
  overallScore: numeric("overall_score", { precision: 4, scale: 2 }).notNull().default("0"),
  reviewCount: integer("review_count").notNull().default(0),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const taqyeemReviews = pgTable("taqyeem_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id").notNull().references(() => taqyeemBusinesses.id),
  userId: uuid("user_id").notNull().references(() => taqyeemUsers.id),
  overallRating: integer("overall_rating").notNull(),
  serviceRating: integer("service_rating").notNull().default(0),
  staffRating: integer("staff_rating").notNull().default(0),
  cleanlinessRating: integer("cleanliness_rating").notNull().default(0),
  valueRating: integer("value_rating").notNull().default(0),
  waitTimeRating: integer("wait_time_rating").notNull().default(0),
  text: text("text"),
  geoVerified: boolean("geo_verified").notNull().default(false),
  status: varchar("status", { length: 50 }).notNull().default("approved"),
  helpfulCount: integer("helpful_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const taqyeemResponses = pgTable("taqyeem_responses", {
  id: uuid("id").defaultRandom().primaryKey(),
  reviewId: uuid("review_id").notNull().references(() => taqyeemReviews.id),
  businessId: uuid("business_id").notNull().references(() => taqyeemBusinesses.id),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const taqyeemRegRequests = pgTable("taqyeem_reg_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  businessNameAr: varchar("business_name_ar", { length: 255 }),
  sector: varchar("sector", { length: 100 }),
  city: varchar("city", { length: 100 }),
  contactEmail: varchar("contact_email", { length: 255 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 50 }),
  ownerName: varchar("owner_name", { length: 255 }),
  tier: varchar("tier", { length: 50 }).notNull().default("free"),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type User = typeof taqyeemUsers.$inferSelect;
export type Business = typeof taqyeemBusinesses.$inferSelect;
export type Review = typeof taqyeemReviews.$inferSelect;
export type Response = typeof taqyeemResponses.$inferSelect;
export type RegRequest = typeof taqyeemRegRequests.$inferSelect;
