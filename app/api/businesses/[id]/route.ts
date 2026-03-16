import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, or } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const businesses = await db
      .select()
      .from(schema.taqyeemBusinesses)
      .where(
        or(
          eq(schema.taqyeemBusinesses.id, id),
          eq(schema.taqyeemBusinesses.slug, id)
        )
      )
      .limit(1);

    const business = businesses[0];
    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const reviews = await db
      .select({
        id: schema.taqyeemReviews.id,
        overallRating: schema.taqyeemReviews.overallRating,
        serviceRating: schema.taqyeemReviews.serviceRating,
        staffRating: schema.taqyeemReviews.staffRating,
        cleanlinessRating: schema.taqyeemReviews.cleanlinessRating,
        valueRating: schema.taqyeemReviews.valueRating,
        waitTimeRating: schema.taqyeemReviews.waitTimeRating,
        text: schema.taqyeemReviews.text,
        geoVerified: schema.taqyeemReviews.geoVerified,
        status: schema.taqyeemReviews.status,
        helpfulCount: schema.taqyeemReviews.helpfulCount,
        createdAt: schema.taqyeemReviews.createdAt,
        userName: schema.taqyeemUsers.name,
      })
      .from(schema.taqyeemReviews)
      .leftJoin(schema.taqyeemUsers, eq(schema.taqyeemReviews.userId, schema.taqyeemUsers.id))
      .where(eq(schema.taqyeemReviews.businessId, business.id))
      .orderBy(schema.taqyeemReviews.createdAt)
      .limit(20);

    return NextResponse.json({ business, reviews });
  } catch (err) {
    console.error("[api/businesses/[id]] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
