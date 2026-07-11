/**
 * Single news item API
 *   PATCH   /api/news/[id]   — update (admin only)
 *   DELETE  /api/news/[id]   — delete (super_admin only)
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

  const existing = await db.news.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await db.news.update({
    where: { id },
    data: {
      titleEn: body.titleEn ?? existing.titleEn,
      titleAm: body.titleAm ?? existing.titleAm,
      bodyEn: body.bodyEn ?? existing.bodyEn,
      bodyAm: body.bodyAm ?? existing.bodyAm,
      category: body.category ?? existing.category,
      pinned: body.pinned ?? existing.pinned,
      published: body.published ?? existing.published,
      publishedAt:
        body.published && !existing.publishedAt
          ? new Date()
          : existing.publishedAt,
    },
  });

  await audit({
    actorId: admin.id,
    action: "news.update",
    target: `news:${id}`,
    detail: `Updated: ${updated.titleEn}`,
    ip: req.headers.get("x-forwarded-for") || undefined,
  });

  return NextResponse.json({ news: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = requireAdmin(req);
  if (!admin || admin.role !== "super_admin") {
    return NextResponse.json(
      { error: "Only super administrators can delete news items." },
      { status: 403 }
    );
  }
  const { id } = await params;

  const existing = await db.news.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.news.delete({ where: { id } });

  await audit({
    actorId: admin.id,
    action: "news.delete",
    target: `news:${id}`,
    detail: `Deleted: ${existing.titleEn}`,
    ip: req.headers.get("x-forwarded-for") || undefined,
  });

  return NextResponse.json({ ok: true });
}
