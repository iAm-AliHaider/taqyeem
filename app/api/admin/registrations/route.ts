import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (!session?.user || role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const requests = await db
      .select()
      .from(schema.taqyeemRegRequests)
      .where(eq(schema.taqyeemRegRequests.status, "pending"))
      .orderBy(desc(schema.taqyeemRegRequests.createdAt));

    return NextResponse.json({ requests });
  } catch (err) {
    console.error("[api/admin/registrations] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
