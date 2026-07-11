/**
 * List applications submitted by the currently-signed-in applicant.
 *   GET /api/applications/mine?userId=...
 * Returns applications where submittedById === userId OR where the
 * application's email matches the user's email (covers legacy/seed apps).
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  // Look up the user to get their email (so we can match legacy apps by email too)
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const apps = await db.application.findMany({
    where: {
      OR: [{ submittedById: userId }, { email: user.email }],
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ applications: apps });
}
