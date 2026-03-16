import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (!session?.user || role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json() as { status: "approved" | "rejected" };
    const { status } = body;

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await db
      .update(schema.taqyeemRegRequests)
      .set({ status })
      .where(eq(schema.taqyeemRegRequests.id, id))
      .returning();

    if (status === "approved") {
      const req = updated[0];
      if (req) {
        const slug = req.businessName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        await db.insert(schema.taqyeemBusinesses).values({
          slug: `${slug}-${Date.now()}`,
          name: req.businessName,
          nameAr: req.businessNameAr ?? undefined,
          sector: req.sector ?? undefined,
          city: req.city ?? undefined,
          tier: req.tier,
          status: "active",
          verified: false,
        });
      }
    }

    return NextResponse.json({ request: updated[0] });
  } catch (err) {
    console.error("[api/admin/registrations/[id]] PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
