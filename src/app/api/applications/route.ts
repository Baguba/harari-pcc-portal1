/**
 * Applications API
 *   GET    /api/applications              — list (admin only)
 *   POST   /api/applications              — create a new application (public)
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

  const url = new URL(req.url);
  const status = url.searchParams.get("status") || undefined;
  const q = url.searchParams.get("q") || undefined;

  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;
  if (q) {
    where.OR = [
      { contactName: { contains: q } },
      { organizationName: { contains: q } },
      { email: { contains: q } },
      { categoryCode: { contains: q } },
      { categoryTitle: { contains: q } },
      { nationalId: { contains: q } },
    ];
  }

  const apps = await db.application.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ applications: apps });
}

export async function POST(req: NextRequest) {
  const actorId = req.headers.get("x-actor-id");
  if (!actorId) {
    return NextResponse.json(
      { error: "Authentication is required to submit applications." },
      { status: 401 }
    );
  }

  const actor = await db.user.findUnique({
    where: { id: actorId },
  });
  if (!actor) {
    return NextResponse.json(
      { error: "Authenticated user not found." },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const required = [
    "categoryCode",
    "categoryNum",
    "categoryTitle",
    "applicantType",
    "contactName",
    "email",
    "phone",
    "city",
    "addressLine",
  ];
  for (const f of required) {
    if (!body[f] || String(body[f]).trim() === "") {
      return NextResponse.json(
        { error: `Missing required field: ${f}` },
        { status: 400 }
      );
    }
  }

  if (body.applicantType === "organization" && !body.organizationName) {
    return NextResponse.json(
      { error: "Organization name is required for organization applicants." },
      { status: 400 }
    );
  }

  // Block applications for monopoly categories (#25 national postal, #28 national telecom)
  if (Number(body.categoryNum) === 25 || Number(body.categoryNum) === 28) {
    return NextResponse.json(
      {
        error:
          "This category is reserved for the state enterprise and is not open to private applicants.",
      },
      { status: 403 }
    );
  }

  const nationalId = String(body.nationalId || "").replace(/[\s-]/g, "");
  if (!/^\d{16}$/.test(nationalId)) {
    return NextResponse.json(
      { error: "National ID must be exactly a 16-digit number." },
      { status: 400 }
    );
  }

  const created = await db.application.create({
    data: {
      categoryCode: String(body.categoryCode),
      categoryNum: Number(body.categoryNum),
      categoryTitle: String(body.categoryTitle),
      applicantType: String(body.applicantType),
      organizationName: body.organizationName || null,
      contactName: String(body.contactName),
      email: String(body.email),
      phone: String(body.phone),
      region: body.region || "Harari",
      city: String(body.city),
      addressLine: String(body.addressLine),
      tinNumber: body.tinNumber || null,
      nationalId: nationalId || null,
      readinessPercent: Number(body.readinessPercent) || 0,
      uploadedDocuments: String(body.uploadedDocuments || ""),
      notes: body.notes || null,
      status: "submitted",
      submittedById: actor.id,
    },
  });

  // Save documents data if uploaded
  if (body.documentsData && Array.isArray(body.documentsData)) {
    try {
      const fs = require("fs");
      const path = require("path");
      const uploadDir = path.join(process.cwd(), "public", "uploads", created.id);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      for (const doc of body.documentsData) {
        if (doc.name && doc.content) {
          const parts = doc.content.split(";base64,");
          const base64Data = parts.length > 1 ? parts[1] : parts[0];
          const filePath = path.join(uploadDir, doc.name);
          fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
        }
      }
    } catch (err) {
      console.error("Failed to save uploaded documents:", err);
    }
  }

  // Notify all admins + super_admins
  const admins = await db.user.findMany({
    where: { role: { in: ["super_admin", "admin"] }, active: true },
  });
  for (const a of admins) {
    await db.notification.create({
      data: {
        userId: a.id,
        title: "New application submitted",
        body: `${created.contactName} — ${created.categoryCode} ${created.categoryTitle}`,
        type: "application",
        link: `admin/application/${created.id}`,
        applicationId: created.id,
      },
    });
  }

  await audit({
    action: "application.submit",
    target: `application:${created.id}`,
    detail: `New application from ${created.contactName} for category ${created.categoryCode}`,
    ip: req.headers.get("x-forwarded-for") || undefined,
  });

  return NextResponse.json({ application: created }, { status: 201 });
}
