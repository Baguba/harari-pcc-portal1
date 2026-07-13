/**
 * Admin dashboard metrics API
 *   GET /api/metrics   — aggregated stats for the admin dashboard
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

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

  const [
    total,
    submitted,
    underReview,
    approved,
    reviewed,
    rejected,
    recent,
    byCategory,
    statusGrouped,
  ] = await Promise.all([
    db.application.count(),
    db.application.count({ where: { status: "submitted" } }),
    db.application.count({ where: { status: "under_review" } }),
    db.application.count({ where: { status: "approved" } }),
    db.application.count({ where: { status: "reviewed" } }),
    db.application.count({ where: { status: "rejected" } }),
    db.application.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
    db.application.groupBy({
      by: ["categoryCode"],
      _count: { _all: true },
      orderBy: { _count: { categoryCode: "desc" } },
      take: 10,
    }),
    db.application.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  // Build last-7-days timeseries
  const days: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    const count = await db.application.count({
      where: { createdAt: { gte: d, lt: next } },
    });
    days.push({
      date: d.toISOString().slice(0, 10),
      count,
    });
  }

  const statusBreakdown = statusGrouped.map((s) => ({
    status: s.status,
    count: s._count._all,
  }));

  return NextResponse.json({
    totals: {
      total,
      submitted,
      underReview,
      approved,
      reviewed,
      rejected,
      recent,
    },
    byCategory: byCategory.map((c) => ({
      code: c.categoryCode,
      count: c._count._all,
    })),
    statusBreakdown,
    timeseries: days,
  });
}
