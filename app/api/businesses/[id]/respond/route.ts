import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "admin" && userRole !== "business_owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: businessId } = await params;
    const body = await req.json() as { reviewId: string; text: string };
    const { reviewId, text } = body;

    if (!reviewId || !text?.trim()) {
      return NextResponse.json({ error: "reviewId and text are required" }, { status: 400 });
    }

    const inserted = await db
      .insert(schema.taqyeemResponses)
      .values({
        reviewId,
        businessId,
        text: text.trim(),
      })
      .returning();

    return NextResponse.json({ response: inserted[0] }, { status: 201 });
  } catch (err) {
    console.error("[api/businesses/[id]/respond] POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
