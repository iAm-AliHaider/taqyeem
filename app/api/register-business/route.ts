import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as {
      businessName: string;
      businessNameAr?: string;
      sector?: string;
      city?: string;
      contactEmail: string;
      contactPhone?: string;
      ownerName?: string;
      tier?: string;
    };

    const { businessName, businessNameAr, sector, city, contactEmail, contactPhone, ownerName, tier = "free" } = body;

    if (!businessName?.trim() || !contactEmail?.trim()) {
      return NextResponse.json(
        { error: "businessName and contactEmail are required" },
        { status: 400 }
      );
    }

    const inserted = await db
      .insert(schema.taqyeemRegRequests)
      .values({
        businessName: businessName.trim(),
        businessNameAr: businessNameAr?.trim(),
        sector,
        city,
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone?.trim(),
        ownerName: ownerName?.trim(),
        tier,
        status: "pending",
      })
      .returning();

    return NextResponse.json({ request: inserted[0] }, { status: 201 });
  } catch (err) {
    console.error("[api/register-business] POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
