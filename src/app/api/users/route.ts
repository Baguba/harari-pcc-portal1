/**
 * Users API (admin/applicant management)
 *   GET    /api/users              — list all users (admin+)
 *   POST   /api/users              — create a new admin/applicant (super_admin only)
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";

function requireAdmin(req: NextRequest) {
  const actorId = req.headers.get("x-actor-id");
  const actorRole = req.headers.get("x-actor-role");
  if (!actorId || (actorRole !== "super_admin" && actorRole !== "admin")) {
    return null;
  }
  return { id: actorId, role: actorRole as "super_admin" | "admin" };
}

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      region: true,
      active: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin || admin.role !== "super_admin") {
    return NextResponse.json(
      { error: "Only super administrators can create new users." },
      { status: 403 }
    );
  }
  const body = await req.json().catch(() => null);
  if (!body || !body.email || !body.password || !body.role) {
    return NextResponse.json(
      { error: "Email, password, and role are required." },
      { status: 400 }
    );
  }
  if (!["super_admin", "admin", "applicant"].includes(body.role)) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  const existing = await db.user.findUnique({ where: { email: body.email.toLowerCase() } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use." }, { status: 409 });
  }

  const created = await db.user.create({
    data: {
      email: body.email.toLowerCase(),
      password: body.password,
      name: body.name || null,
      role: body.role,
      phone: body.phone || null,
      region: body.region || null,
      active: body.active ?? true,
    },
  });

  await audit({
    actorId: admin.id,
    action: "user.create",
    target: `user:${created.id}`,
    detail: `Created ${created.role} user: ${created.email}`,
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
        active: created.active,
      },
    },
    { status: 201 }
  );
}
