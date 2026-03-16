import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, or, desc } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const businesses = await db
      .select({ id: schema.taqyeemBusinesses.id })
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
      .orderBy(desc(schema.taqyeemReviews.createdAt));

    return NextResponse.json({ reviews });
  } catch (err) {
    console.error("[api/businesses/[id]/reviews] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const businesses = await db
      .select({ id: schema.taqyeemBusinesses.id })
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

    const body = await req.json() as {
      overallRating: number;
      serviceRating?: number;
      staffRating?: number;
      cleanlinessRating?: number;
      valueRating?: number;
      waitTimeRating?: number;
      text?: string;
      geoVerified?: boolean;
    };

    const { overallRating, serviceRating = 0, staffRating = 0, cleanlinessRating = 0, valueRating = 0, waitTimeRating = 0, text, geoVerified = false } = body;

    if (!overallRating || overallRating < 1 || overallRating > 5) {
      return NextResponse.json({ error: "overallRating must be 1–5" }, { status: 400 });
    }

    const inserted = await db
      .insert(schema.taqyeemReviews)
      .values({
        businessId: business.id,
        userId: session.user.id as string,
        overallRating,
        serviceRating,
        staffRating,
        cleanlinessRating,
        valueRating,
        waitTimeRating,
        text,
        geoVerified,
        status: "approved",
      })
      .returning();

    // Recalculate business score
    const allReviews = await db
      .select({ overallRating: schema.taqyeemReviews.overallRating })
      .from(schema.taqyeemReviews)
      .where(eq(schema.taqyeemReviews.businessId, business.id));

    const count = allReviews.length;
    const avg = count > 0 ? allReviews.reduce((sum, r) => sum + r.overallRating, 0) / count : 0;

    await db
      .update(schema.taqyeemBusinesses)
      .set({
        reviewCount: count,
        overallScore: avg.toFixed(2),
      })
      .where(eq(schema.taqyeemBusinesses.id, business.id));

    return NextResponse.json({ review: inserted[0] }, { status: 201 });
  } catch (err) {
    console.error("[api/businesses/[id]/reviews] POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
