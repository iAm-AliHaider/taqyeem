import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, and, ilike, or, desc, asc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sector = searchParams.get("sector");
    const city = searchParams.get("city");
    const sort = searchParams.get("sort") ?? "score";
    const search = searchParams.get("search");

    const conditions = [eq(schema.taqyeemBusinesses.status, "active")];

    if (sector && sector !== "all") {
      conditions.push(eq(schema.taqyeemBusinesses.sector, sector));
    }
    if (city && city !== "all") {
      conditions.push(eq(schema.taqyeemBusinesses.city, city));
    }
    if (search) {
      conditions.push(
        or(
          ilike(schema.taqyeemBusinesses.name, `%${search}%`),
          ilike(schema.taqyeemBusinesses.nameAr ?? schema.taqyeemBusinesses.name, `%${search}%`)
        )!
      );
    }

    const orderBy =
      sort === "reviews"
        ? desc(schema.taqyeemBusinesses.reviewCount)
        : sort === "newest"
        ? desc(schema.taqyeemBusinesses.createdAt)
        : desc(schema.taqyeemBusinesses.overallScore);

    const businesses = await db
      .select()
      .from(schema.taqyeemBusinesses)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(50);

    return NextResponse.json({ businesses });
  } catch (err) {
    console.error("[api/businesses] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
