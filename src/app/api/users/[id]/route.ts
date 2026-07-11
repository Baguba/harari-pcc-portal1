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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = requireAdmin(req);
  if (!admin || admin.role !== "super_admin") {
    return NextResponse.json(
      { error: "Only super administrators can modify users." },
      { status: 403 }
    );
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const target = await db.user.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Cannot demote the last super_admin
  if (target.role === "super_admin" && body.role && body.role !== "super_admin") {
    const superCount = await db.user.count({ where: { role: "super_admin", active: true } });
    if (superCount <= 1) {
      return NextResponse.json(
        { error: "Cannot demote the last active super administrator." },
        { status: 400 }
      );
    }
  }

  const updated = await db.user.update({
    where: { id },
    data: {
      name: body.name ?? target.name,
      role: body.role ?? target.role,
      phone: body.phone ?? target.phone,
      region: body.region ?? target.region,
      active: body.active ?? target.active,
      password: body.password ? body.password : undefined,
    },
  });

  await audit({
    actorId: admin.id,
    action: "user.update",
    target: `user:${id}`,
    detail: `Updated ${updated.email} — role: ${updated.role}, active: ${updated.active}`,
    ip: req.headers.get("x-forwarded-for") || undefined,
  });

  return NextResponse.json({
    user: {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
      phone: updated.phone,
      region: updated.region,
      active: updated.active,
    },
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = requireAdmin(req);
  if (!admin || admin.role !== "super_admin") {
    return NextResponse.json(
      { error: "Only super administrators can delete users." },
      { status: 403 }
    );
  }
  const { id } = await params;
  if (id === admin.id) {
    return NextResponse.json(
      { error: "You cannot delete your own account while signed in." },
      { status: 400 }
    );
  }

  const target = await db.user.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (target.role === "super_admin") {
    const superCount = await db.user.count({ where: { role: "super_admin", active: true } });
    if (superCount <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the last active super administrator." },
        { status: 400 }
      );
    }
  }

  await db.user.delete({ where: { id } });

  await audit({
    actorId: admin.id,
    action: "user.delete",
    target: `user:${id}`,
    detail: `Deleted ${target.email}`,
    ip: req.headers.get("x-forwarded-for") || undefined,
  });

  return NextResponse.json({ ok: true });
}
