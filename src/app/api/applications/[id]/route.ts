/**
 * Single-application API
 *   GET    /api/applications/[id]   — fetch one
 *   PATCH  /api/applications/[id]   — update status / review note (admin only)
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const app = await db.application.findUnique({ where: { id } });
  if (!app) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ application: app });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const existing = await db.application.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const newStatus = body.status || existing.status;
  const reviewNote = body.reviewNote !== undefined ? body.reviewNote : existing.reviewNote;

  // Once approved, status cannot be changed or removed
  if (existing.status === "approved" && newStatus !== "approved") {
    return NextResponse.json(
      { error: "Once approved, an application's status cannot be changed or removed." },
      { status: 400 }
    );
  }


  // Role-based status restrictions:
  // Regular admins can only set: submitted, under_review, reviewed
  // Super admins can set any status including: approved, rejected, revoked
  const adminOnlyStatuses = ["submitted", "under_review", "reviewed"];
  if (admin.role === "admin" && !adminOnlyStatuses.includes(newStatus)) {
    return NextResponse.json(
      { error: "Only super administrators can approve, reject, or revoke applications." },
      { status: 403 }
    );
  }

  const updated = await db.application.update({
    where: { id },
    data: {
      status: newStatus,
      reviewNote,
      reviewedAt: new Date(),
      reviewedById: admin.id,
    },
  });

  // Notify the applicant's email-linked user if one exists
  const linkedUser = await db.user.findUnique({
    where: { email: existing.email },
  });
  if (linkedUser) {
    await db.notification.create({
      data: {
        userId: linkedUser.id,
        title: `Application ${newStatus}`,
        body: `Your application for ${existing.categoryTitle} is now: ${newStatus}.`,
        type: newStatus === "approved" ? "success" : newStatus === "rejected" ? "warning" : newStatus === "reviewed" ? "info" : "info",
        link: `admin/application/${id}`,
        applicationId: id,
      },
    });
  }

  await audit({
    actorId: admin.id,
    action: `application.${newStatus}`,
    target: `application:${id}`,
    detail: `Status set to ${newStatus}. Note: ${reviewNote || "(none)"}`,
    ip: req.headers.get("x-forwarded-for") || undefined,
  });

  return NextResponse.json({ application: updated });
}
