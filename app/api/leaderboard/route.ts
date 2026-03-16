import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const businesses = await db
      .select()
      .from(schema.taqyeemBusinesses)
      .where(eq(schema.taqyeemBusinesses.status, "active"))
      .orderBy(desc(schema.taqyeemBusinesses.overallScore))
      .limit(20);

    return NextResponse.json({ businesses });
  } catch (err) {
    console.error("[api/leaderboard] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
