import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { db, schema } from "@/lib/db";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

const SECRET = process.env.SEED_SECRET || "seed-taqyeem-2026";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");
    if (secret !== SECRET) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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

    let seedUserId = adminResult[0]?.id;
    if (!seedUserId) {
      const existing = await db.select({ id: schema.taqyeemUsers.id }).from(schema.taqyeemUsers).limit(1);
      seedUserId = existing[0]?.id;
    }

    if (!seedUserId) {
      return NextResponse.json({ error: "Could not create admin user" }, { status: 500 });
    }

    const businessData = [
      { slug: "stc-riyadh", name: "STC", nameAr: "STC", sector: "telecom", city: "riyadh", lat: "24.7136", lng: "46.6753", tier: "platinum", verified: true },
      { slug: "alrajhi-bank", name: "Al Rajhi Bank", nameAr: "مصرف الراجحي", sector: "banking", city: "riyadh", lat: "24.6877", lng: "46.7219", tier: "platinum", verified: true },
      { slug: "herfy-riyadh", name: "Herfy", nameAr: "هرفي", sector: "food", city: "riyadh", lat: "24.7011", lng: "46.6855", tier: "gold", verified: true },
      { slug: "toyota-saudi", name: "Toyota Saudi Arabia", nameAr: "تويوتا السعودية", sector: "automotive", city: "riyadh", lat: "24.6958", lng: "46.7358", tier: "gold", verified: false },
      { slug: "ikea-riyadh", name: "IKEA Riyadh", nameAr: "إيكيا الرياض", sector: "retail", city: "riyadh", lat: "24.7746", lng: "46.6596", tier: "silver", verified: false },
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

    const seededBusinesses: string[] = [];

    for (const biz of businessData) {
      const inserted = await db
        .insert(schema.taqyeemBusinesses)
        .values({ ...biz, status: "active", overallScore: "0", reviewCount: 0 })
        .onConflictDoNothing()
        .returning({ id: schema.taqyeemBusinesses.id });

      const bizId = inserted[0]?.id;
      if (!bizId) {
        seededBusinesses.push(`${biz.name}: already exists`);
        continue;
      }

      const ratings = [5, 5, 4, 5, 4, 3, 5, 4, 4, 3];
      for (let i = 0; i < 10; i++) {
        await db.insert(schema.taqyeemReviews).values({
          businessId: bizId,
          userId: seedUserId!,
          overallRating: ratings[i],
          serviceRating: 4,
          staffRating: 4,
          cleanlinessRating: 4,
          valueRating: 4,
          waitTimeRating: 3,
          text: reviewTexts[i],
          geoVerified: true,
          status: "approved",
        });
      }

      const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      await db.update(schema.taqyeemBusinesses)
        .set({ reviewCount: 10, overallScore: avg.toFixed(2) })
        .where(eq(schema.taqyeemBusinesses.id, bizId));

      seededBusinesses.push(`${biz.name}: seeded with 10 reviews (avg: ${avg.toFixed(2)})`);
    }

    void pool; // ensure pool stays alive

    return NextResponse.json({
      success: true,
      adminEmail: "admin@taqyeem.sa",
      adminPassword: "taqyeem2026",
      seededBusinesses,
    });
  } catch (err) {
    console.error("[api/admin/seed] Error:", err);
    return NextResponse.json({ error: "Seed failed", details: String(err) }, { status: 500 });
  }
}
