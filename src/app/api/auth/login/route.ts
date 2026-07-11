/**
 * Auth API — POST /api/auth/login
 * Authenticates any user (super_admin, admin, or applicant) and returns the user object.
 * Session is kept client-side in memory (Zustand); no JWT/cookie for simplicity.
 *
 * POST /api/auth/me — returns the current session user (stateless).
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { verifyPassword } from "@/lib/password";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email: string = (body.email || "").trim().toLowerCase();
  const password: string = body.password || "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.active) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  // Verify password (supports both hashed and legacy plain-text passwords)
  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  await audit({
    actorId: user.id,
    action: "auth.login",
    target: `user:${user.id}`,
    detail: `${user.role} logged in`,
    ip: req.headers.get("x-forwarded-for") || undefined,
  });

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      region: user.region,
    },
  });
}
