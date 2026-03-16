import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import * as schema from "./schema";

const DATABASE_URL = process.env.DATABASE_URL || "postgres://nexus:aliali123@uetzne9sq4m1aai7cv8wwlrf:5432/middlemind";

async function seed() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log("[seed] Starting...");

  // Run migrations first
  await pool.query(`
    CREATE TABLE IF NOT EXISTS taqyeem_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'user',
      review_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS taqyeem_businesses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      name_ar VARCHAR(255),
      sector VARCHAR(100),
      city VARCHAR(100),
      address TEXT,
      lat NUMERIC(10,7),
      lng NUMERIC(10,7),
      geofence_radius INTEGER NOT NULL DEFAULT 200,
      phone VARCHAR(50),
      website VARCHAR(500),
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      tier VARCHAR(50) NOT NULL DEFAULT 'free',
      owner_id UUID REFERENCES taqyeem_users(id),
      overall_score NUMERIC(4,2) NOT NULL DEFAULT 0,
      review_count INTEGER NOT NULL DEFAULT 0,
      verified BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS taqyeem_reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      business_id UUID NOT NULL REFERENCES taqyeem_businesses(id),
      user_id UUID NOT NULL REFERENCES taqyeem_users(id),
      overall_rating INTEGER NOT NULL,
      service_rating INTEGER NOT NULL DEFAULT 0,
      staff_rating INTEGER NOT NULL DEFAULT 0,
      cleanliness_rating INTEGER NOT NULL DEFAULT 0,
      value_rating INTEGER NOT NULL DEFAULT 0,
      wait_time_rating INTEGER NOT NULL DEFAULT 0,
      text TEXT,
      geo_verified BOOLEAN NOT NULL DEFAULT false,
      status VARCHAR(50) NOT NULL DEFAULT 'approved',
      helpful_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS taqyeem_responses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      review_id UUID NOT NULL REFERENCES taqyeem_reviews(id),
      business_id UUID NOT NULL REFERENCES taqyeem_businesses(id),
      text TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS taqyeem_reg_requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      business_name VARCHAR(255) NOT NULL,
      business_name_ar VARCHAR(255),
      sector VARCHAR(100),
      city VARCHAR(100),
      contact_email VARCHAR(255) NOT NULL,
      contact_phone VARCHAR(50),
      owner_name VARCHAR(255),
      tier VARCHAR(50) NOT NULL DEFAULT 'free',
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  console.log("[seed] Tables ready");

  // Admin user
  const adminHash = await hash("taqyeem2026", 12);
  const adminResult = await db
    .insert(schema.taqyeemUsers)
    .values({
      email: "admin@taqyeem.sa",
      passwordHash: adminHash,
      name: "Taqyeem Admin",
      role: "admin",
    })
    .onConflictDoNothing()
    .returning({ id: schema.taqyeemUsers.id });

  const adminId = adminResult[0]?.id;
  console.log("[seed] Admin user ready:", adminId ? "created" : "already exists");

  // Get or fetch admin id
  let seedUserId = adminId;
  if (!seedUserId) {
    const existing = await db
      .select({ id: schema.taqyeemUsers.id })
      .from(schema.taqyeemUsers)
      .limit(1);
    seedUserId = existing[0]?.id;
  }

  if (!seedUserId) {
    console.error("[seed] No user to attach reviews to");
    await pool.end();
    return;
  }

  // Sample businesses
  const businessData = [
    {
      slug: "stc-riyadh",
      name: "STC",
      nameAr: "STC",
      sector: "telecom",
      city: "riyadh",
      lat: "24.7136",
      lng: "46.6753",
      tier: "platinum",
      verified: true,
      website: "https://stc.com.sa",
    },
    {
      slug: "alrajhi-bank",
      name: "Al Rajhi Bank",
      nameAr: "مصرف الراجحي",
      sector: "banking",
      city: "riyadh",
      lat: "24.6877",
      lng: "46.7219",
      tier: "platinum",
      verified: true,
      website: "https://alrajhibank.com.sa",
    },
    {
      slug: "herfy-riyadh",
      name: "Herfy",
      nameAr: "هرفي",
      sector: "food",
      city: "riyadh",
      lat: "24.7011",
      lng: "46.6855",
      tier: "gold",
      verified: true,
      website: "https://herfy.com",
    },
    {
      slug: "toyota-saudi",
      name: "Toyota Saudi Arabia",
      nameAr: "تويوتا السعودية",
      sector: "automotive",
      city: "riyadh",
      lat: "24.6958",
      lng: "46.7358",
      tier: "gold",
      verified: false,
      website: "https://toyota.com.sa",
    },
    {
      slug: "ikea-riyadh",
      name: "IKEA Riyadh",
      nameAr: "إيكيا الرياض",
      sector: "retail",
      city: "riyadh",
      lat: "24.7746",
      lng: "46.6596",
      tier: "silver",
      verified: false,
      website: "https://ikea.com/sa",
    },
  ];

  const reviewTexts = [
    "Excellent service! Highly recommend to everyone.",
    "Great experience, staff was very helpful and professional.",
    "Average service, could be improved in several areas.",
    "Very impressed with the quality and speed of service.",
    "Good overall but the wait time was longer than expected.",
    "Outstanding customer service. Will definitely come back.",
    "The staff was friendly and knowledgeable. Great visit.",
    "Decent experience, nothing exceptional but solid.",
    "Really happy with my visit, everything went smoothly.",
    "Could be better, but overall an acceptable experience.",
  ];

  for (const biz of businessData) {
    const inserted = await db
      .insert(schema.taqyeemBusinesses)
      .values({
        ...biz,
        status: "active",
        overallScore: "0",
        reviewCount: 0,
      })
      .onConflictDoNothing()
      .returning({ id: schema.taqyeemBusinesses.id });

    const bizId = inserted[0]?.id;
    if (!bizId) {
      console.log(`[seed] Business ${biz.name} already exists, skipping reviews`);
      continue;
    }

    console.log(`[seed] Inserted business: ${biz.name}`);

    // 10 reviews per business
    const ratings = [5, 5, 4, 5, 4, 3, 5, 4, 4, 3];
    for (let i = 0; i < 10; i++) {
      await db.insert(schema.taqyeemReviews).values({
        businessId: bizId,
        userId: seedUserId,
        overallRating: ratings[i],
        serviceRating: Math.floor(Math.random() * 2) + 3,
        staffRating: Math.floor(Math.random() * 2) + 3,
        cleanlinessRating: Math.floor(Math.random() * 2) + 3,
        valueRating: Math.floor(Math.random() * 2) + 3,
        waitTimeRating: Math.floor(Math.random() * 2) + 3,
        text: reviewTexts[i],
        geoVerified: true,
        status: "approved",
      });
    }

    // Recalculate score
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    await db
      .update(schema.taqyeemBusinesses)
      .set({ reviewCount: 10, overallScore: avg.toFixed(2) })
      .where(eq(schema.taqyeemBusinesses.id, bizId));

    console.log(`[seed] Added 10 reviews for ${biz.name}, avg score: ${avg.toFixed(2)}`);
  }

  console.log("[seed] Done!");
  await pool.end();
}

seed().catch((err) => {
  console.error("[seed] Error:", err);
  process.exit(1);
});
