/**
 * Super Admin Profile API
 *   GET    /api/profile   — get stamp and signature URLs for the current super admin
 *   PATCH  /api/profile   — upload stamp and/or signature (base64)
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

function requireSuperAdmin(req: NextRequest) {
  const actorId = req.headers.get("x-actor-id");
  const actorRole = req.headers.get("x-actor-role");
  if (!actorId || actorRole !== "super_admin") {
    return null;
  }
  return { id: actorId, role: actorRole };
}

/** Also allow any admin to GET (so certificates can fetch stamp/sig) */
function requireAdmin(req: NextRequest) {
  const actorId = req.headers.get("x-actor-id");
  const actorRole = req.headers.get("x-actor-role");
  if (!actorId || (actorRole !== "super_admin" && actorRole !== "admin" && actorRole !== "applicant")) {
    return null;
  }
  return { id: actorId, role: actorRole };
}

export async function GET(req: NextRequest) {
  const actor = requireAdmin(req);
  if (!actor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find any super admin's stamp/signature (use the first active super admin)
  const superAdmin = await db.user.findFirst({
    where: { role: "super_admin", active: true },
    select: { stampUrl: true, signatureUrl: true },
  });

  return NextResponse.json({
    stampUrl: superAdmin?.stampUrl || null,
    signatureUrl: superAdmin?.signatureUrl || null,
  });
}

export async function PATCH(req: NextRequest) {
  const admin = requireSuperAdmin(req);
  if (!admin) {
    return NextResponse.json(
      { error: "Only super administrators can update profile." },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const uploadDir = path.join(process.cwd(), "public", "uploads", "profile");
  await mkdir(uploadDir, { recursive: true });

  const updateData: Record<string, string> = {};

  // Process stamp upload
  if (body.stamp) {
    const { data, filename } = body.stamp as { data: string; filename: string };
    const ext = path.extname(filename) || ".png";
    const stampFilename = `stamp-${admin.id}${ext}`;
    const filePath = path.join(uploadDir, stampFilename);
    const buffer = Buffer.from(data, "base64");
    await writeFile(filePath, buffer);
    updateData.stampUrl = `/uploads/profile/${stampFilename}`;
  }

  // Process signature upload
  if (body.signature) {
    const { data, filename } = body.signature as { data: string; filename: string };
    const ext = path.extname(filename) || ".png";
    const sigFilename = `signature-${admin.id}${ext}`;
    const filePath = path.join(uploadDir, sigFilename);
    const buffer = Buffer.from(data, "base64");
    await writeFile(filePath, buffer);
    updateData.signatureUrl = `/uploads/profile/${sigFilename}`;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No files provided." }, { status: 400 });
  }

  const updated = await db.user.update({
    where: { id: admin.id },
    data: updateData,
    select: { stampUrl: true, signatureUrl: true },
  });

  return NextResponse.json({
    stampUrl: updated.stampUrl,
    signatureUrl: updated.signatureUrl,
  });
}
