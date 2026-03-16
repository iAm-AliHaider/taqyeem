import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, count } from "drizzle-orm";

export async function GET() {
  try {
    const [businessCount] = await db
      .select({ count: count() })
      .from(schema.taqyeemBusinesses)
      .where(eq(schema.taqyeemBusinesses.status, "active"));

    const [reviewCount] = await db
      .select({ count: count() })
      .from(schema.taqyeemReviews)
      .where(eq(schema.taqyeemReviews.status, "approved"));

    const [userCount] = await db
      .select({ count: count() })
      .from(schema.taqyeemUsers);

    const [verifiedCount] = await db
      .select({ count: count() })
      .from(schema.taqyeemBusinesses)
      .where(eq(schema.taqyeemBusinesses.verified, true));

    return NextResponse.json({
      businesses: businessCount.count,
      reviews: reviewCount.count,
      users: userCount.count,
      verified: verifiedCount.count,
    });
  } catch (err) {
    console.error("[api/stats] GET error:", err);
    return NextResponse.json({ businesses: 0, reviews: 0, users: 0, verified: 0 });
  }
}
