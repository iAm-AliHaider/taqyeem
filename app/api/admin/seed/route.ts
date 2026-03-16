import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Simple secret protection
  const { secret } = await request.json().catch(() => ({ secret: "" }));
  if (secret !== "taqyeem-seed-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { seed } = await import("@/lib/db/seed");
    await seed();
    return NextResponse.json({ ok: true, message: "Seed completed" });
  } catch (error) {
    console.error("[seed route]", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
