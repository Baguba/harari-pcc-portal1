/**
 * News API
 *   GET    /api/news           — list published (public) or all (admin)
 *   POST   /api/news           — create (admin only)
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
  const includeUnpublished = !!admin;

  const news = await db.news.findMany({
    where: includeUnpublished ? {} : { published: true },
    orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    take: 50,
  });
  return NextResponse.json({ news });
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body || !body.titleEn || !body.titleAm || !body.bodyEn || !body.bodyAm) {
    return NextResponse.json(
      { error: "Missing required fields (title/body in both languages)." },
      { status: 400 }
    );
  }

  const created = await db.news.create({
    data: {
      titleEn: body.titleEn,
      titleAm: body.titleAm,
      bodyEn: body.bodyEn,
      bodyAm: body.bodyAm,
      category: body.category || "general",
      pinned: !!body.pinned,
      published: !!body.published,
      publishedAt: body.published ? new Date() : null,
    },
  });

  if (created.published) {
    const users = await db.user.findMany({
      where: { role: "applicant", active: true },
    });
    for (const u of users) {
      await db.notification.create({
        data: {
          userId: u.id,
          title: `News: ${created.titleEn}`,
          body: created.bodyEn.slice(0, 200),
          type: "news",
          link: "news",
          newsId: created.id,
        },
      });
    }
  }

  await audit({
    actorId: admin.id,
    action: "news.create",
    target: `news:${created.id}`,
    detail: `Created news: ${created.titleEn}`,
    ip: req.headers.get("x-forwarded-for") || undefined,
  });

  return NextResponse.json({ news: created }, { status: 201 });
}
