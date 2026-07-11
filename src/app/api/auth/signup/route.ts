/**
 * Applicant self-signup
 *   POST /api/auth/signup
 * Body: { email, password, name, phone, region }
 * Creates a new applicant-role user (no admin privileges).
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { hashPassword, validatePasswordStrength } from "@/lib/password";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email: string = (body.email || "").trim().toLowerCase();
  const password: string = body.password || "";
  const name: string = (body.name || "").trim();
  const phone: string = (body.phone || "").trim();
  const region: string = (body.region || "Harari").trim();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  // Enforce strong password policy
  const pwError = validatePasswordStrength(password);
  if (pwError) {
    return NextResponse.json({ error: pwError }, { status: 400 });
  }

  if (!email.includes("@") || email.length < 5) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists. Please sign in instead." },
      { status: 409 }
    );
  }

  // Hash password before storing
  const hashedPassword = await hashPassword(password);

  const created = await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || null,
      role: "applicant",
      phone: phone || null,
      region: region || null,
      active: true,
    },
  });

  await audit({
    actorId: created.id,
    action: "auth.signup",
    target: `user:${created.id}`,
    detail: `New applicant registered: ${created.email}`,
    ip: req.headers.get("x-forwarded-for") || undefined,
  });

  return NextResponse.json(
    {
      user: {
        id: created.id,
        email: created.email,
        name: created.name,
        role: created.role,
        phone: created.phone,
        region: created.region,
      },
    },
    { status: 201 }
  );
}
