import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { name: string; email: string; password: string };
    const { name, email, password } = body;

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await db
      .select({ id: schema.taqyeemUsers.id })
      .from(schema.taqyeemUsers)
      .where(eq(schema.taqyeemUsers.email, email.toLowerCase().trim()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);

    const inserted = await db
      .insert(schema.taqyeemUsers)
      .values({
        email: email.toLowerCase().trim(),
        passwordHash,
        name: name.trim(),
        role: "user",
      })
      .returning({ id: schema.taqyeemUsers.id, email: schema.taqyeemUsers.email, name: schema.taqyeemUsers.name });

    return NextResponse.json({ user: inserted[0] }, { status: 201 });
  } catch (err) {
    console.error("[api/auth/register] POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
