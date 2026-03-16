import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { auth } from "@/auth";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (!session?.user || role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const businesses = await db
      .select()
      .from(schema.taqyeemBusinesses)
      .orderBy(desc(schema.taqyeemBusinesses.createdAt))
      .limit(100);

    return NextResponse.json({ businesses });
  } catch (err) {
    console.error("[api/admin/businesses] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
